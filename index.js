import 'dotenv/config';

import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
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
    GatewayIntentBits.GuildMessages
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
    .setDescription('Republica Welcome e painel de cargos')
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
   GRUPOS DE CARGO
========================================================= */

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
   BOTÕES
========================================================= */

const buttonRoleMap = {
  input_controle: '🎮・CONTROLE',
  input_mnk: '⌨️・MOUSE & KEYBOARD',

  platform_pc: '🖥️・PC',
  platform_ps: '🟦・PLAYSTATION',
  platform_xbox: '🟩・XBOX',
  platform_gfn: '☁️・GEFORCE NOW',

  mode_warzone: '🪂・WARZONE',
  mode_ranked: '🏆・RANKED',
  mode_multi: '💥・MULTIPLAYER',
  mode_zombies: '🧟・ZOMBIES'
};

function criarBotoesCargos() {
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('input_controle')
      .setLabel('Controle')
      .setEmoji('🎮')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('input_mnk')
      .setLabel('Mouse & Keyboard')
      .setEmoji('⌨️')
      .setStyle(ButtonStyle.Secondary)
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('platform_pc')
      .setLabel('PC')
      .setEmoji('🖥️')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('platform_ps')
      .setLabel('PlayStation')
      .setEmoji('🟦')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('platform_xbox')
      .setLabel('Xbox')
      .setEmoji('🟩')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('platform_gfn')
      .setLabel('GeForce NOW')
      .setEmoji('☁️')
      .setStyle(ButtonStyle.Secondary)
  );

  const row3 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('mode_warzone')
      .setLabel('Warzone')
      .setEmoji('🪂')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('mode_ranked')
      .setLabel('Ranked')
      .setEmoji('🏆')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('mode_multi')
      .setLabel('Multiplayer')
      .setEmoji('💥')
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId('mode_zombies')
      .setLabel('Zombies')
      .setEmoji('🧟')
      .setStyle(ButtonStyle.Secondary)
  );

  return [row1, row2, row3];
}

/* =========================================================
   CANAIS ESPECIAIS
========================================================= */

const commandOnlyChannels = [
  '🔫・loadouts',
  '🏆・ranked',
  '📊・stats'
];

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

async function configurarPermissoes(
  guild,
  roles
) {
  const everyone = guild.roles.everyone;

  const welcome = guild.channels.cache.find(
    c => c.name === '📡・bem-vindo'
  );

  const cargos = guild.channels.cache.find(
    c => c.name === '🎭・cargos'
  );

  const avisos = guild.channels.cache.find(
    c => c.name === '📢・avisos'
  );

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

  if (cargos) {
    await cargos.permissionOverwrites.edit(
      everyone,
      {
        ViewChannel: true,
        SendMessages: false,
        AddReactions: false,
        ReadMessageHistory: true
      }
    );
  }

  if (avisos) {
    await avisos.permissionOverwrites.edit(
      everyone,
      {
        ViewChannel: true,
        SendMessages: false
      }
    );
  }

  for (const channel of [
    welcome,
    cargos,
    avisos
  ]) {
    if (!channel) continue;

    await channel.permissionOverwrites.edit(
      roles['👑・404 // FOUNDER'],
      {
        SendMessages: true
      }
    );

    await channel.permissionOverwrites.edit(
      roles['🛡️・404 // ADMIN'],
      {
        SendMessages: true
      }
    );
  }
}

/* =========================================================
   LIMPAR MENSAGENS ANTIGAS DO BOT
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
   WELCOME
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
   PAINEL DE CARGOS
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

  await channel.send({
    files: [image],
    components: criarBotoesCargos()
  });
}

/* =========================================================
   PUBLICAR PAINÉIS
========================================================= */

async function publicarPaineis(guild) {
  await publicarWelcome(guild);
  await publicarCargos(guild);
}

/* =========================================================
   SETUP
========================================================= */

async function setup(guild) {
  const roles = {};

  for (const [name, color] of roleDefs) {
    roles[name] =
      await ensureRole(
        guild,
        name,
        color
      );
  }

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

  await configurarPermissoes(
    guild,
    roles
  );

  await publicarPaineis(guild);

  return roles;
}

/* =========================================================
   BOTÃO DE CARGO
========================================================= */

async function processarBotaoCargo(
  interaction
) {
  const roleName =
    buttonRoleMap[
      interaction.customId
    ];

  if (!roleName) return;

  const guild =
    interaction.guild;

  const member =
    await guild.members.fetch(
      interaction.user.id
    );

  const selectedRole =
    guild.roles.cache.find(
      role =>
        role.name === roleName
    );

  if (!selectedRole) {
    return interaction.reply({
      content:
        '❌ Cargo não encontrado.',
      ephemeral: true
    });
  }

  /*
    Se já tem:
    remove o cargo.
  */

  if (
    member.roles.cache.has(
      selectedRole.id
    )
  ) {
    await member.roles.remove(
      selectedRole
    );

    return interaction.reply({
      content:
        `➖ Cargo **${roleName}** removido.`,
      ephemeral: true
    });
  }

  /*
    INPUT exclusivo
  */

  if (
    inputRoles.includes(roleName)
  ) {
    for (
      const otherName
      of inputRoles
    ) {
      if (
        otherName === roleName
      ) continue;

      const otherRole =
        guild.roles.cache.find(
          role =>
            role.name ===
            otherName
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
    PLATAFORMA exclusiva
  */

  if (
    platformRoles.includes(roleName)
  ) {
    for (
      const otherName
      of platformRoles
    ) {
      if (
        otherName === roleName
      ) continue;

      const otherRole =
        guild.roles.cache.find(
          role =>
            role.name ===
            otherName
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
    GAME MODE pode ter vários.
  */

  await member.roles.add(
    selectedRole
  );

  return interaction.reply({
    content:
      `✅ Cargo **${roleName}** adicionado.`,
    ephemeral: true
  });
}

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
    ) return;

    /*
      Bots sempre podem responder.
    */

    if (message.author.bot) {
      return;
    }

    /*
      Staff pode conversar.
    */

    if (
      isStaff(message.member)
    ) {
      return;
    }

    /*
      LOADOUT / STATS / RANKED

      Slash commands não geram
      mensagem normal do usuário.

      Texto comum é apagado.
    */

    if (
      commandOnlyChannels.includes(
        message.channel.name
      )
    ) {
      await message.delete()
        .catch(() => {});

      return;
    }

    /*
      UPDATES
      só bots + staff
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
   INTERAÇÕES
========================================================= */

client.on(
  'interactionCreate',
  async interaction => {
    /*
      BOTÕES DE CARGO
    */

    if (
      interaction.isButton()
    ) {
      try {
        await processarBotaoCargo(
          interaction
        );
      } catch (error) {
        console.error(
          'Erro no botão:',
          error
        );

        if (
          !interaction.replied &&
          !interaction.deferred
        ) {
          await interaction.reply({
            content:
              '❌ Não consegui alterar seu cargo.',
            ephemeral: true
          }).catch(() => {});
        }
      }

      return;
    }

    /*
      SLASH COMMANDS
    */

    if (
      !interaction.isChatInputCommand()
    ) return;

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
      Proteção extra
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
          '✅ **404 // NO SIGNAL** atualizado.\n\n📡 Welcome publicado\n🎭 Painel com botões publicado\n🔒 Permissões aplicadas'
        );
      } catch (error) {
        console.error(error);

        await interaction.editReply(
          '❌ Erro no setup. Confira os logs do Railway e se existem `assets/welcome.png` e `assets/cargos.png`.'
        );
      }
    }

    /*
      PAINEL
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
