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

import path from 'node:path';
import fs from 'node:fs';

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  throw new Error(
    'Configure DISCORD_TOKEN, CLIENT_ID e GUILD_ID.'
  );
}

/* =========================================================
   CLIENT
========================================================= */

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
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

const setupCommand = new SlashCommandBuilder()
  .setName('setup404')
  .setDescription('Monta a estrutura oficial do 404')
  .setDefaultMemberPermissions(
    PermissionFlagsBits.Administrator
  );

const painelCommand = new SlashCommandBuilder()
  .setName('painel404')
  .setDescription('Republica as imagens de boas-vindas e cargos')
  .setDefaultMemberPermissions(
    PermissionFlagsBits.Administrator
  );


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
   CATEGORIAS / CANAIS
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
   SISTEMA DE REAÇÕES
========================================================= */

/*
  São exatamente as reações que vão aparecer
  embaixo da imagem de cargos.
*/

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

const gameModeRoles = [
  '🪂・WARZONE',
  '🏆・RANKED',
  '💥・MULTIPLAYER',
  '🧟・ZOMBIES'
];


/* =========================================================
   HELPERS
========================================================= */

async function role(guild, name, color) {

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


async function chan(
  guild,
  name,
  type,
  parent,
  overwrites
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

      permissionOverwrites: overwrites,

      reason: '404 Setup'

    });

  }

  return found;
}


/* =========================================================
   LIMPAR MENSAGENS ANTIGAS DO BOT
========================================================= */

async function limparMensagensDoBot(channel) {

  try {

    const mensagens =
      await channel.messages.fetch({
        limit: 50
      });

    const minhas = mensagens.filter(
      msg => msg.author.id === client.user.id
    );

    for (const msg of minhas.values()) {

      await msg.delete().catch(() => {});

    }

  } catch (error) {

    console.error(
      `Erro limpando ${channel.name}:`,
      error
    );

  }

}


/* =========================================================
   PAINEL DE BOAS-VINDAS
========================================================= */

async function enviarWelcome(guild) {

  const channel =
    guild.channels.cache.find(
      c => c.name === '📡・bem-vindo'
    );

  if (!channel) {
    throw new Error(
      'Canal 📡・bem-vindo não encontrado.'
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
      'Arquivo assets/welcome.png não encontrado.'
    );

  }

  await limparMensagensDoBot(channel);

  const attachment =
    new AttachmentBuilder(imagePath, {
      name: '404-welcome.png'
    });

  await channel.send({
    files: [attachment]
  });

}


/* =========================================================
   PAINEL DE CARGOS
========================================================= */

async function enviarPainelCargos(guild) {

  const channel =
    guild.channels.cache.find(
      c => c.name === '🎭・cargos'
    );

  if (!channel) {

    throw new Error(
      'Canal 🎭・cargos não encontrado.'
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
      'Arquivo assets/cargos.png não encontrado.'
    );

  }

  await limparMensagensDoBot(channel);

  const attachment =
    new AttachmentBuilder(imagePath, {
      name: '404-cargos.png'
    });

  const message = await channel.send({
    files: [attachment]
  });


  /*
    Ordem visual das reações:
  */

  const reactions = [
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

  for (const emoji of reactions) {

    await message.react(emoji);

  }

}


/* =========================================================
   PUBLICAR PAINÉIS
========================================================= */

async function publicarPaineis(guild) {

  await enviarWelcome(guild);
  await enviarPainelCargos(guild);

}


/* =========================================================
   SETUP DO SERVIDOR
========================================================= */

async function setup(guild) {

  const roles = {};

  for (const [name, color] of roleDefs) {

    roles[name] =
      await role(
        guild,
        name,
        color
      );

  }


  const everyone =
    guild.roles.everyone;


  for (const [catName, children] of categories) {

    let overwrites = [];


    /*
      BUNKER
      apenas membros 404
    */

    if (
      catName ===
      '🔒・404 // BUNKER'
    ) {

      overwrites = [

        {
          id: everyone.id,

          deny: [
            PermissionFlagsBits.ViewChannel
          ]
        },

        {
          id: roles['⚡・404'].id,

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
      catName === '🛡️・STAFF'
    ) {

      overwrites = [

        {
          id: everyone.id,

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


    let category =
      guild.channels.cache.find(
        c =>
          c.name === catName &&
          c.type === ChannelType.GuildCategory
      );


    if (!category) {

      category =
        await guild.channels.create({

          name: catName,

          type:
            ChannelType.GuildCategory,

          permissionOverwrites:
            overwrites,

          reason:
            '404 Setup'

        });

    }


    for (const [name, type] of children) {

      await chan(
        guild,
        name,
        type,
        category,
        []
      );

    }

  }


  /*
    Publica as artes
  */

  await publicarPaineis(guild);


  return roles;

}


/* =========================================================
   APLICAR CARGO
========================================================= */

async function aplicarCargo(
  reaction,
  user
) {

  if (user.bot) return;


  /*
    Em caso da mensagem estar parcial
    após reiniciar o bot
  */

  if (reaction.partial) {

    try {

      await reaction.fetch();

    } catch {

      return;

    }

  }


  const message =
    reaction.message;


  /*
    Só funciona no canal de cargos
  */

  if (
    message.channel.name !==
    '🎭・cargos'
  ) {
    return;
  }


  /*
    Só aceita reação em mensagem enviada
    pelo próprio bot
  */

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

  if (!selectedRole) {

    console.log(
      `Cargo não encontrado: ${roleName}`
    );

    return;

  }


  /*
    ================================
    INPUT
    apenas UM por pessoa
    ================================
  */

  if (
    inputRoles.includes(roleName)
  ) {

    for (
      const otherRoleName
      of inputRoles
    ) {

      if (
        otherRoleName === roleName
      ) {
        continue;
      }

      const otherRole =
        guild.roles.cache.find(
          r =>
            r.name ===
            otherRoleName
        );

      if (
        otherRole &&
        member.roles.cache.has(
          otherRole.id
        )
      ) {

        await member.roles.remove(
          otherRole
        );

      }

    }

  }


  /*
    ================================
    PLATAFORMA
    apenas UMA por pessoa
    ================================
  */

  if (
    platformRoles.includes(roleName)
  ) {

    for (
      const otherRoleName
      of platformRoles
    ) {

      if (
        otherRoleName === roleName
      ) {
        continue;
      }

      const otherRole =
        guild.roles.cache.find(
          r =>
            r.name ===
            otherRoleName
        );

      if (
        otherRole &&
        member.roles.cache.has(
          otherRole.id
        )
      ) {

        await member.roles.remove(
          otherRole
        );

      }

    }

  }


  /*
    GAME MODES
    não remove os outros.
    Pode ter vários.
  */


  /*
    Finalmente aplica o cargo
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
   REMOVER CARGO AO TIRAR REAÇÃO
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
   EVENTOS DE REAÇÃO
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
   READY
========================================================= */

client.once(
  'ready',
  async () => {

    console.log(
      `404 Setup online como ${client.user.tag}`
    );


    await rest.put(

      Routes.applicationGuildCommands(
        CLIENT_ID,
        GUILD_ID
      ),

      {
        body: [
          setupCommand.toJSON(),
          painelCommand.toJSON()
        ]
      }

    );


    console.log(
      '/setup404 e /painel404 registrados.'
    );

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
      SETUP COMPLETO
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
          '✅ Estrutura **404 // NO SIGNAL** atualizada.\n📡 Welcome publicado.\n🎭 Painel de cargos publicado.\n⚡ Reações configuradas.'
        );

      } catch (error) {

        console.error(error);


        await interaction.editReply(
          '❌ Erro no setup. Confira os logs do Railway, as imagens da pasta `assets` e se o bot possui **Administrador**.'
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
          '✅ Painéis do **404** republicados.'
        );

      } catch (error) {

        console.error(error);


        await interaction.editReply(
          '❌ Não consegui publicar os painéis. Confira se existem `assets/welcome.png` e `assets/cargos.png`.'
        );

      }

    }

  }
);


/* =========================================================
   LOGIN
========================================================= */

client.login(TOKEN);
