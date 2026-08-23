import 'dotenv/config';

import {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  AttachmentBuilder
} from 'discord.js';

import fs from 'node:fs';
import path from 'node:path';

/* =========================================================
   CONFIG
========================================================= */

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  throw new Error(
    'Configure DISCORD_TOKEN, CLIENT_ID e GUILD_ID.'
  );
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions
  ],

  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
});

const rest = new REST({
  version: '10'
}).setToken(TOKEN);

/* =========================================================
   COMANDOS
========================================================= */

const commands = [

  new SlashCommandBuilder()
    .setName('setup404')
    .setDescription('Monta/atualiza a estrutura oficial do 404')
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  new SlashCommandBuilder()
    .setName('painel404')
    .setDescription('Republica Welcome e seleção de cargos')
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    )

];

/* =========================================================
   CARGOS
========================================================= */

const roleDefs = [

  ['━━━「 404 STAFF 」━━━', 0x2b2d31],
  ['👑・404 // FOUNDER', 0x8e44ad],
  ['🛡️・404 // ADMIN', 0x71368a],

  ['━━━「 404 CREW 」━━━', 0x2b2d31],
  ['⚡・404', 0x9b59b6],
  ['🤝・ALIADO', 0x95a5a6],

  ['━━━「 INPUT 」━━━', 0x2b2d31],
  ['🎮・CONTROLE', 0x5865f2],
  ['⌨️・MOUSE & KEYBOARD', 0x99aab5],

  ['━━━「 PLATFORM 」━━━', 0x2b2d31],
  ['🖥️・PC', 0x99aab5],
  ['🟦・PLAYSTATION', 0x3498db],
  ['🟩・XBOX', 0x57f287],
  ['☁️・GEFORCE NOW', 0x2ecc71],

  ['━━━「 GAME MODES 」━━━', 0x2b2d31],
  ['🪂・WARZONE', 0xe67e22],
  ['🏆・RANKED', 0xf1c40f],
  ['💥・MULTIPLAYER', 0xe74c3c],
  ['🧟・ZOMBIES', 0x57f287],

  ['━━━「 SYSTEM 」━━━', 0x2b2d31],
  ['🤖・BOTS', 0x5865f2]

];

/* =========================================================
   CATEGORIAS
========================================================= */

const categories = [

  [
    '👾・START HERE',
    [
      ['📡・bem-vindo', 'text'],
      ['🎭・cargos', 'text'],
      ['📢・avisos', 'text']
    ]
  ],

  [
    '💬・404 // QG',
    [
      ['💬・geral', 'text'],
      ['😂・memes', 'text'],
      ['📸・clips-e-highlights', 'text'],
      ['🤖・comandos', 'text']
    ]
  ],

  [
    '🔫・404 // CALL OF DUTY',
    [
      ['🎯・cod', 'text'],
      ['🔫・loadouts', 'text'],
      ['🏆・ranked', 'text'],
      ['📊・stats', 'text'],
      ['📰・updates', 'text']
    ]
  ],

  [
    '🎮・404 // GAMING',
    [
      ['🎮・outros-jogos', 'text'],
      ['🔎・bora-jogar', 'text']
    ]
  ],

  [
    '🔊・404 // COMMS',
    [
      ['🔊・Lobby', 'voice'],
      ['☢️・Warzone', 'voice'],
      ['🏆・Ranked', 'voice'],
      ['🍻・Resenha', 'voice']
    ]
  ],

  [
    '🔒・404 // BUNKER',
    [
      ['💬・clã', 'text'],
      ['🎯・estratégias', 'text'],
      ['📅・marcar-jogatina', 'text'],
      ['🔊・Bunker 404', 'voice']
    ]
  ],

  [
    '🛡️・STAFF',
    [
      ['⚙️・staff', 'text'],
      ['📋・logs', 'text']
    ]
  ]

];

/* =========================================================
   REAÇÕES -> CARGOS
========================================================= */

const reactionRoles = {

  // INPUT
  '🎮': '🎮・CONTROLE',
  '⌨️': '⌨️・MOUSE & KEYBOARD',

  // PLATAFORMA
  '🖥️': '🖥️・PC',
  '🟦': '🟦・PLAYSTATION',
  '🟩': '🟩・XBOX',
  '☁️': '☁️・GEFORCE NOW',

  // GAME MODES
  '🪂': '🪂・WARZONE',
  '🏆': '🏆・RANKED',
  '💥': '💥・MULTIPLAYER',
  '🧟': '🧟・ZOMBIES'

};

const inputRoles = [
  '🎮・CONTROLE',
  '⌨️・MOUSE & KEYBOARD'
];

const platformRoles = [
  '🖥️・PC',
  '🟦・PLAYSTATION',
  '🟩・XBOX',
  '☁️・GEFORCE NOW'
];

const roleToEmoji = {};

for (const [emoji, roleName] of Object.entries(reactionRoles)) {
  roleToEmoji[roleName] = emoji;
}

/* =========================================================
   CANAIS ESPECIAIS
========================================================= */

/*
  Nesses canais:
  Slash commands funcionam normalmente.
  Mensagem comum de membro é apagada.

  Também deixei mensagens começando com !
  porque alguns bots de COD ainda usam prefixo.
*/

const commandOnlyChannels = [
  '🔫・loadouts',
  '🏆・ranked',
  '📊・stats'
];

/*
  Aqui membros não conversam.
  Bots podem publicar e Staff também.
*/

const botPublicationChannels = [
  '📰・updates'
];

/* =========================================================
   HELPERS
========================================================= */

function isStaff(member) {

  if (!member) return false;

  return (
    member.permissions.has(
      PermissionFlagsBits.Administrator
    ) ||

    member.roles.cache.some(
      role =>
        role.name === '👑・404 // FOUNDER' ||
        role.name === '🛡️・404 // ADMIN'
    )
  );

}

async function ensureRole(guild, name, color) {

  let found = guild.roles.cache.find(
    r => r.name === name
  );

  if (!found) {

    found = await guild.roles.create({
      name,
      color,
      reason: '404 Setup'
    });

  }

  return found;
}

async function ensureChannel(
  guild,
  name,
  type,
  parent
) {

  let found = guild.channels.cache.find(
    c =>
      c.name === name &&
      c.parentId === parent?.id
  );

  if (!found) {

    found = await guild.channels.create({

      name,

      type:
        type === 'voice'
          ? ChannelType.GuildVoice
          : ChannelType.GuildText,

      parent: parent?.id,

      reason: '404 Setup'

    });

  }

  return found;
}

/* =========================================================
   PERMISSÕES
========================================================= */

async function configurarPermissoes(guild, roles) {

  const everyone = guild.roles.everyone;

  /*
    START HERE
  */

  const welcome = guild.channels.cache.find(
    c => c.name === '📡・bem-vindo'
  );

  const cargos = guild.channels.cache.find(
    c => c.name === '🎭・cargos'
  );

  const avisos = guild.channels.cache.find(
    c => c.name === '📢・avisos'
  );

  /*
    BEM-VINDO
    membro apenas lê
  */

  if (welcome) {

    await welcome.permissionOverwrites.edit(
      everyone,
      {
        ViewChannel: true,
        SendMessages: false,
        AddReactions: false
      }
    );

  }

  /*
    CARGOS
    membro não escreve,
    mas pode reagir
  */

  if (cargos) {

    await cargos.permissionOverwrites.edit(
      everyone,
      {
        ViewChannel: true,
        SendMessages: false,
        AddReactions: true,
        ReadMessageHistory: true
      }
    );

  }

  /*
    AVISOS
  */

  if (avisos) {

    await avisos.permissionOverwrites.edit(
      everyone,
      {
        ViewChannel: true,
        SendMessages: false
      }
    );

  }

  /*
    STAFF pode escrever nos 3
  */

  for (const channel of [
    welcome,
    cargos,
    avisos
  ]) {

    if (!channel) continue;

    await channel.permissionOverwrites.edit(
      roles['👑・404 // FOUNDER'],
      {
        SendMessages: true,
        AddReactions: true
      }
    );

    await channel.permissionOverwrites.edit(
      roles['🛡️・404 // ADMIN'],
      {
        SendMessages: true,
        AddReactions: true
      }
    );

  }

}

/* =========================================================
   LIMPAR MENSAGENS ANTIGAS DO NOSSO BOT
========================================================= */

async function limparMensagensBot(channel) {

  try {

    const messages =
      await channel.messages.fetch({
        limit: 50
      });

    const botMessages =
      messages.filter(
        message =>
          message.author.id ===
          client.user.id
      );

    for (const message of botMessages.values()) {

      await message.delete()
        .catch(() => {});

    }

  } catch (error) {

    console.error(
      `Erro limpando ${channel.name}`,
      error
    );

  }

}

/* =========================================================
   IMAGEM WELCOME
========================================================= */

async function publicarWelcome(guild) {

  const channel =
    guild.channels.cache.find(
      c => c.name === '📡・bem-vindo'
    );

  if (!channel) {
    throw new Error(
      'Canal bem-vindo não encontrado.'
    );
  }

  const imagePath =
    path.join(
      process.cwd(),
      'assets',
      'welcome.png'
    );

  if (!fs.existsSync(imagePath)) {

    throw new Error(
      'assets/welcome.png não encontrado.'
    );

  }

  await limparMensagensBot(channel);

  const image =
    new AttachmentBuilder(
      imagePath,
      {
        name: '404-welcome.png'
      }
    );

  await channel.send({
    files: [image]
  });

}

/* =========================================================
   IMAGEM / CARGOS
========================================================= */

async function publicarCargos(guild) {

  const channel =
    guild.channels.cache.find(
      c => c.name === '🎭・cargos'
    );

  if (!channel) {
    throw new Error(
      'Canal cargos não encontrado.'
    );
  }

  const imagePath =
    path.join(
      process.cwd(),
      'assets',
      'cargos.png'
    );

  if (!fs.existsSync(imagePath)) {

    throw new Error(
      'assets/cargos.png não encontrado.'
    );

  }

  await limparMensagensBot(channel);

  const image =
    new AttachmentBuilder(
      imagePath,
      {
        name: '404-cargos.png'
      }
    );

  const message =
    await channel.send({
      files: [image]
    });

  /*
    Ordem das reações
  */

  const emojis = [
    '🎮',
    '⌨️',

    '🖥️',
    '🟦',
    '🟩',
    '☁️',

    '🪂',
    '🏆',
    '💥',
    '🧟'
  ];

  for (const emoji of emojis) {

    await message.react(emoji);

  }

}

/* =========================================================
   PUBLICAR OS DOIS PAINÉIS
========================================================= */

async function publicarPaineis(guild) {

  await publicarWelcome(guild);
  await publicarCargos(guild);

}

/* =========================================================
   SETUP
========================================================= */

async function setup(guild) {

  /*
    CARGOS
  */

  const roles = {};

  for (const [name, color] of roleDefs) {

    roles[name] =
      await ensureRole(
        guild,
        name,
        color
      );

  }

  /*
    CATEGORIAS
  */

  for (
    const [categoryName, children]
    of categories
  ) {

    let category =
      guild.channels.cache.find(
        c =>
          c.name === categoryName &&
          c.type ===
          ChannelType.GuildCategory
      );

    /*
      BUNKER
    */

    let permissionOverwrites = [];

    if (
      categoryName ===
      '🔒・404 // BUNKER'
    ) {

      permissionOverwrites = [

        {
          id:
            guild.roles.everyone.id,

          deny: [
            PermissionFlagsBits.ViewChannel
          ]
        },

        {
          id:
            roles['⚡・404'].id,

          allow: [
            PermissionFlagsBits.ViewChannel
          ]
        }

      ];

    }

    /*
      STAFF
    */

    if (
      categoryName ===
      '🛡️・STAFF'
    ) {

      permissionOverwrites = [

        {
          id:
            guild.roles.everyone.id,

          deny: [
            PermissionFlagsBits.ViewChannel
          ]
        },

        {
          id:
            roles[
              '👑・404 // FOUNDER'
            ].id,

          allow: [
            PermissionFlagsBits.ViewChannel
          ]
        },

        {
          id:
            roles[
              '🛡️・404 // ADMIN'
            ].id,

          allow: [
            PermissionFlagsBits.ViewChannel
          ]
        }

      ];

    }

    if (!category) {

      category =
        await guild.channels.create({

          name: categoryName,

          type:
            ChannelType.GuildCategory,

          permissionOverwrites,

          reason:
            '404 Setup'

        });

    }

    /*
      Atualiza permissões se
      categoria já existia
    */

    if (
      categoryName ===
        '🔒・404 // BUNKER' ||
      categoryName ===
        '🛡️・STAFF'
    ) {

      await category.edit({
        permissionOverwrites
      });

    }

    /*
      CANAIS
    */

    for (
      const [name, type]
      of children
    ) {

      await ensureChannel(
        guild,
        name,
        type,
        category
      );

    }

  }

  /*
    PERMISSÕES START HERE
  */

  await configurarPermissoes(
    guild,
    roles
  );

  /*
    PAINÉIS
  */

  await publicarPaineis(guild);

  return roles;

}

/* =========================================================
   REMOVER REAÇÃO ANTIGA
   INPUT / PLATAFORMA
========================================================= */

async function removerReacaoAnterior(
  message,
  user,
  roleName
) {

  let group = null;

  if (inputRoles.includes(roleName)) {
    group = inputRoles;
  }

  if (platformRoles.includes(roleName)) {
    group = platformRoles;
  }

  if (!group) return;

  for (const otherRole of group) {

    if (otherRole === roleName) {
      continue;
    }

    const oldEmoji =
      roleToEmoji[otherRole];

    if (!oldEmoji) continue;

    const reaction =
      message.reactions.cache.find(
        r =>
          r.emoji.name ===
          oldEmoji
      );

    if (!reaction) continue;

    /*
      Remove somente a reação
      daquele usuário.
    */

    await reaction.users
      .remove(user.id)
      .catch(() => {});

  }

}

/* =========================================================
   ADICIONAR CARGO
========================================================= */

async function aplicarCargo(
  reaction,
  user
) {

  if (user.bot) return;

  if (reaction.partial) {

    try {
      await reaction.fetch();
    } catch {
      return;
    }

  }

  const message =
    reaction.message;

  if (
    message.channel.name !==
    '🎭・cargos'
  ) {
    return;
  }

  if (
    message.author?.id !==
    client.user.id
  ) {
    return;
  }

  const emoji =
    reaction.emoji.name;

  const roleName =
    reactionRoles[emoji];

  if (!roleName) return;

  const guild =
    message.guild;

  if (!guild) return;

  const member =
    await guild.members
      .fetch(user.id)
      .catch(() => null);

  if (!member) return;

  const selectedRole =
    guild.roles.cache.find(
      r => r.name === roleName
    );

  if (!selectedRole) return;

  /*
    INPUT EXCLUSIVO
  */

  if (
    inputRoles.includes(roleName)
  ) {

    for (
      const oldRoleName
      of inputRoles
    ) {

      if (
        oldRoleName === roleName
      ) {
        continue;
      }

      const oldRole =
        guild.roles.cache.find(
          r =>
            r.name ===
            oldRoleName
        );

      if (
        oldRole &&
        member.roles.cache.has(
          oldRole.id
        )
      ) {

        await member.roles.remove(
          oldRole
        );

      }

    }

    await removerReacaoAnterior(
      message,
      user,
      roleName
    );

  }

  /*
    PLATAFORMA EXCLUSIVA
  */

  if (
    platformRoles.includes(roleName)
  ) {

    for (
      const oldRoleName
      of platformRoles
    ) {

      if (
        oldRoleName === roleName
      ) {
        continue;
      }

      const oldRole =
        guild.roles.cache.find(
          r =>
            r.name ===
            oldRoleName
        );

      if (
        oldRole &&
        member.roles.cache.has(
          oldRole.id
        )
      ) {

        await member.roles.remove(
          oldRole
        );

      }

    }

    await removerReacaoAnterior(
      message,
      user,
      roleName
    );

  }

  /*
    ADICIONA
  */

  if (
    !member.roles.cache.has(
      selectedRole.id
    )
  ) {

    await member.roles.add(
      selectedRole
    );

    console.log(
      `${user.tag} recebeu ${roleName}`
    );

  }

}

/* =========================================================
   REMOVER CARGO
========================================================= */

async function removerCargo(
  reaction,
  user
) {

  if (user.bot) return;

  if (reaction.partial) {

    try {
      await reaction.fetch();
    } catch {
      return;
    }

  }

  const message =
    reaction.message;

  if (
    message.channel.name !==
    '🎭・cargos'
  ) {
    return;
  }

  if (
    message.author?.id !==
    client.user.id
  ) {
    return;
  }

  const emoji =
    reaction.emoji.name;

  const roleName =
    reactionRoles[emoji];

  if (!roleName) return;

  const guild =
    message.guild;

  if (!guild) return;

  const member =
    await guild.members
      .fetch(user.id)
      .catch(() => null);

  if (!member) return;

  const selectedRole =
    guild.roles.cache.find(
      r => r.name === roleName
    );

  if (!selectedRole) return;

  if (
    member.roles.cache.has(
      selectedRole.id
    )
  ) {

    await member.roles.remove(
      selectedRole
    );

    console.log(
      `${user.tag} removeu ${roleName}`
    );

  }

}

/* =========================================================
   REAÇÕES
========================================================= */

client.on(
  'messageReactionAdd',
  async (reaction, user) => {

    try {

      await aplicarCargo(
        reaction,
        user
      );

    } catch (error) {

      console.error(
        'Erro adicionando cargo:',
        error
      );

    }

  }
);

client.on(
  'messageReactionRemove',
  async (reaction, user) => {

    try {

      await removerCargo(
        reaction,
        user
      );

    } catch (error) {

      console.error(
        'Erro removendo cargo:',
        error
      );

    }

  }
);

/* =========================================================
   CANAIS SOMENTE COMANDOS
========================================================= */

client.on(
  'messageCreate',
  async message => {

    if (!message.guild) return;

    if (
      message.guild.id !==
      GUILD_ID
    ) {
      return;
    }

    /*
      Bots podem responder/publicar.
    */

    if (message.author.bot) {
      return;
    }

    /*
      Staff pode escrever.
    */

    if (
      isStaff(message.member)
    ) {
      return;
    }

    /*
      LOADOUT / STATS / RANKED

      Slash commands não aparecem
      como mensagem comum.

      Também permitimos !comando
      para compatibilidade com bots
      de prefixo.
    */

    if (
      commandOnlyChannels.includes(
        message.channel.name
      )
    ) {

      if (
        message.content
          ?.trim()
          .startsWith('!')
      ) {

        return;

      }

      await message.delete()
        .catch(() => {});

      return;

    }

    /*
      UPDATES

      apenas bots e staff.
    */

    if (
      botPublicationChannels.includes(
        message.channel.name
      )
    ) {

      await message.delete()
        .catch(() => {});

      return;

    }

  }
);

/* =========================================================
   READY
========================================================= */

client.once(
  'ready',
  async () => {

    console.log(
      `✅ 404 bot online como ${client.user.tag}`
    );

    try {

      await rest.put(

        Routes.applicationGuildCommands(
          CLIENT_ID,
          GUILD_ID
        ),

        {
          body:
            commands.map(
              command =>
                command.toJSON()
            )
        }

      );

      console.log(
        '✅ /setup404 e /painel404 registrados.'
      );

    } catch (error) {

      console.error(
        'Erro registrando comandos:',
        error
      );

    }

  }
);

/* =========================================================
   SLASH COMMANDS
========================================================= */

client.on(
  'interactionCreate',
  async interaction => {

    if (
      !interaction.isChatInputCommand()
    ) {
      return;
    }

    if (
      interaction.guildId !==
      GUILD_ID
    ) {

      return interaction.reply({

        content:
          'Este bot está limitado ao servidor 404.',

        ephemeral: true

      });

    }

    /*
      PROTEÇÃO EXTRA
    */

    if (
      !interaction.memberPermissions
        ?.has(
          PermissionFlagsBits.Administrator
        )
    ) {

      return interaction.reply({

        content:
          '❌ Apenas a administração do 404 pode usar esse comando.',

        ephemeral: true

      });

    }

    /*
      SETUP
    */

    if (
      interaction.commandName ===
      'setup404'
    ) {

      await interaction.deferReply({
        ephemeral: true
      });

      try {

        await setup(
          interaction.guild
        );

        await interaction.editReply(
          '✅ **404 // NO SIGNAL** atualizado.\n\n📡 Welcome publicado\n🎭 Cargos configurados\n🔒 Permissões aplicadas\n⚡ Reações ativadas'
        );

      } catch (error) {

        console.error(error);

        await interaction.editReply(
          '❌ Erro no setup. Confira os logs do Railway e se existem `assets/welcome.png` e `assets/cargos.png`.'
        );

      }

    }

    /*
      SOMENTE PAINÉIS
    */

    if (
      interaction.commandName ===
      'painel404'
    ) {

      await interaction.deferReply({
        ephemeral: true
      });

      try {

        await publicarPaineis(
          interaction.guild
        );

        await interaction.editReply(
          '✅ Welcome e painel de cargos republicados.'
        );

      } catch (error) {

        console.error(error);

        await interaction.editReply(
          '❌ Erro publicando os painéis. Confira a pasta `assets`.'
        );

      }

    }

  }
);

/* =========================================================
   LOGIN
========================================================= */

client.login(TOKEN);
