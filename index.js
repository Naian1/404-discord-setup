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
  ButtonStyle,
  EmbedBuilder
} from 'discord.js';

import fs from 'node:fs';
import path from 'node:path';

/* =========================================================
   CONFIG
========================================================= */

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN || !CLIENT_ID) {
  throw new Error('Configure DISCORD_TOKEN e CLIENT_ID.');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

/* =========================================================
   COMANDOS
========================================================= */

const commands = [
  new SlashCommandBuilder()
    .setName('setup404')
    .setDescription('Monta/atualiza a estrutura oficial do 404')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('painel404')
    .setDescription('Republica Welcome e painel de cargos do 404')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('setupmush')
    .setDescription('Monta/atualiza o servidor do clã Mushroom')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName('painelmush')
    .setDescription('Republica os painéis do servidor Mushroom')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
];

/* =========================================================
   404 - DEFINIÇÕES
========================================================= */

const roleDefs404 = [
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

const categories404 = [
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

const inputRoles404 = ['🎮・CONTROLE', '⌨️・MOUSE & KEYBOARD'];
const platformRoles404 = ['🖥️・PC', '🟦・PLAYSTATION', '🟩・XBOX', '☁️・GEFORCE NOW'];

const commandOnlyChannels404 = ['🔫・loadouts', '🏆・ranked', '📊・stats'];
const botPublicationChannels404 = ['📰・updates'];

/* =========================================================
   MUSH - DEFINIÇÕES
========================================================= */

const roleDefsMush = [
  ['━━━「 MUSH STAFF 」━━━', 0x2b2d31],
  ['👑・MUSH // FOUNDER', 0xf1c40f],
  ['🛡️・MUSH // ADMIN', 0xe67e22],
  ['🔧・MUSH // MOD', 0x3498db],

  ['━━━「 MUSH CLÃ 」━━━', 0x2b2d31],
  ['🍄・MEMBRO DO CLÃ', 0x57f287],
  ['🤝・ALIADO', 0x95a5a6],

  ['━━━「 CLASSE 」━━━', 0x2b2d31],
  ['🏹・ARQUEIRO', 0x2ecc71],
  ['🔮・MAGO', 0x9b59b6],
  ['⚔️・GUERREIRO', 0xe74c3c],

  ['━━━「 FOCO 」━━━', 0x2b2d31],
  ['🌲・PVE', 0x57f287],
  ['🏆・PVP', 0xf1c40f],

  ['━━━「 NOTIFICAÇÕES 」━━━', 0x2b2d31],
  ['🎁・PING CODES', 0x5865f2],
  ['🎉・PING EVENTOS', 0xe91e63]
];

const categoriesMush = [
  [
    '🍄・MUSH // INÍCIO',
    [
      ['🍄・bem-vindo', 'text'],
      ['🎭・escolha-seus-cargos', 'text'],
      ['📜・regras', 'text'],
      ['📢・avisos', 'text']
    ]
  ],
  [
    '🎁・MUSH // CODES & EVENTOS',
    [
      ['🎁・codes', 'text'],
      ['🎉・eventos', 'text'],
      ['📆・calendario', 'text'],
      ['📌・novidades', 'text']
    ]
  ],
  [
    '🧠・MUSH // BUILDS & GUIAS',
    [
      ['🏹・build-arqueiro', 'text'],
      ['🔮・build-mago', 'text'],
      ['⚔️・build-guerreiro', 'text'],
      ['🐾・pets', 'text'],
      ['✨・skills', 'text'],
      ['💡・dicas-e-guias', 'text']
    ]
  ],
  [
    '💬・MUSH // COMUNIDADE',
    [
      ['💬・geral', 'text'],
      ['❓・duvidas', 'text'],
      ['📸・prints-e-drops', 'text'],
      ['🤖・comandos', 'text']
    ]
  ],
  [
    '🔊・MUSH // VOZ',
    [
      ['🍄・Lobby', 'voice'],
      ['🌲・Farm PVE', 'voice'],
      ['🏆・PVP e Arena', 'voice']
    ]
  ],
  [
    '🔒・MUSH // CLÃ',
    [
      ['🍄・chat-do-clã', 'text'],
      ['🧩・estrategias', 'text'],
      ['📋・organizacao', 'text'],
      ['🔊・Sala do Clã', 'voice']
    ]
  ],
  [
    '🛡️・MUSH // STAFF',
    [
      ['⚙️・staff-mush', 'text'],
      ['📋・logs-mush', 'text']
    ]
  ]
];

const classRolesMush = ['🏹・ARQUEIRO', '🔮・MAGO', '⚔️・GUERREIRO'];

const readOnlyChannelsMush = [
  '🍄・bem-vindo',
  '🎭・escolha-seus-cargos',
  '📜・regras',
  '📢・avisos',
  '🎁・codes',
  '🎉・eventos',
  '📆・calendario',
  '📌・novidades'
];

/* =========================================================
   BOTÕES DE CARGO
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
  mode_zombies: '🧟・ZOMBIES',

  mush_class_archer: '🏹・ARQUEIRO',
  mush_class_mage: '🔮・MAGO',
  mush_class_warrior: '⚔️・GUERREIRO',
  mush_focus_pve: '🌲・PVE',
  mush_focus_pvp: '🏆・PVP',
  mush_ping_codes: '🎁・PING CODES',
  mush_ping_events: '🎉・PING EVENTOS'
};

function criarBotoes404() {
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('input_controle').setLabel('Controle').setEmoji('🎮').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('input_mnk').setLabel('Mouse & Keyboard').setEmoji('⌨️').setStyle(ButtonStyle.Secondary)
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('platform_pc').setLabel('PC').setEmoji('🖥️').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('platform_ps').setLabel('PlayStation').setEmoji('🟦').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('platform_xbox').setLabel('Xbox').setEmoji('🟩').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('platform_gfn').setLabel('GeForce NOW').setEmoji('☁️').setStyle(ButtonStyle.Secondary)
  );

  const row3 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('mode_warzone').setLabel('Warzone').setEmoji('🪂').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('mode_ranked').setLabel('Ranked').setEmoji('🏆').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('mode_multi').setLabel('Multiplayer').setEmoji('💥').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('mode_zombies').setLabel('Zombies').setEmoji('🧟').setStyle(ButtonStyle.Secondary)
  );

  return [row1, row2, row3];
}

function criarBotoesMush() {
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('mush_class_archer').setLabel('Arqueiro').setEmoji('🏹').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('mush_class_mage').setLabel('Mago').setEmoji('🔮').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('mush_class_warrior').setLabel('Guerreiro').setEmoji('⚔️').setStyle(ButtonStyle.Danger)
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('mush_focus_pve').setLabel('PVE').setEmoji('🌲').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('mush_focus_pvp').setLabel('PVP').setEmoji('🏆').setStyle(ButtonStyle.Secondary)
  );

  const row3 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('mush_ping_codes').setLabel('Avisar Codes').setEmoji('🎁').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('mush_ping_events').setLabel('Avisar Eventos').setEmoji('🎉').setStyle(ButtonStyle.Secondary)
  );

  return [row1, row2, row3];
}

/* =========================================================
   HELPERS
========================================================= */

function is404Staff(member) {
  if (!member) return false;

  return (
    member.permissions.has(PermissionFlagsBits.Administrator) ||
    member.roles.cache.some(role =>
      role.name === '👑・404 // FOUNDER' ||
      role.name === '🛡️・404 // ADMIN'
    )
  );
}

function isMushStaff(member) {
  if (!member) return false;

  return (
    member.permissions.has(PermissionFlagsBits.Administrator) ||
    member.roles.cache.some(role =>
      role.name === '👑・MUSH // FOUNDER' ||
      role.name === '🛡️・MUSH // ADMIN' ||
      role.name === '🔧・MUSH // MOD'
    )
  );
}

async function ensureRole(guild, name, color, reason) {
  let found = guild.roles.cache.find(role => role.name === name);

  if (!found) {
    found = await guild.roles.create({ name, color, reason });
  }

  return found;
}

async function ensureChannel(guild, name, type, parent, reason) {
  let found = guild.channels.cache.find(channel =>
    channel.name === name && channel.parentId === parent?.id
  );

  if (!found) {
    found = await guild.channels.create({
      name,
      type: type === 'voice' ? ChannelType.GuildVoice : ChannelType.GuildText,
      parent: parent?.id,
      reason
    });
  }

  return found;
}

async function ensureCategory(guild, name, permissionOverwrites, reason) {
  let category = guild.channels.cache.find(channel =>
    channel.name === name && channel.type === ChannelType.GuildCategory
  );

  if (!category) {
    category = await guild.channels.create({
      name,
      type: ChannelType.GuildCategory,
      permissionOverwrites,
      reason
    });
  } else if (permissionOverwrites.length > 0) {
    await category.edit({ permissionOverwrites });
  }

  return category;
}

async function limparMensagensBot(channel) {
  try {
    const messages = await channel.messages.fetch({ limit: 50 });
    const botMessages = messages.filter(message => message.author.id === client.user.id);

    for (const message of botMessages.values()) {
      await message.delete().catch(() => {});
    }
  } catch (error) {
    console.error(`Erro limpando ${channel.name}`, error);
  }
}

async function registerCommandsForGuild(guild) {
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, guild.id),
      { body: commands.map(command => command.toJSON()) }
    );

    console.log(`✅ Comandos registrados em ${guild.name} (${guild.id}).`);
  } catch (error) {
    console.error(`Erro registrando comandos em ${guild.name}:`, error);
  }
}

/* =========================================================
   404 - PERMISSÕES E PAINÉIS
========================================================= */

async function configurarPermissoes404(guild, roles) {
  const everyone = guild.roles.everyone;

  const welcome = guild.channels.cache.find(channel => channel.name === '📡・bem-vindo');
  const cargos = guild.channels.cache.find(channel => channel.name === '🎭・cargos');
  const avisos = guild.channels.cache.find(channel => channel.name === '📢・avisos');

  if (welcome) {
    await welcome.permissionOverwrites.edit(everyone, {
      ViewChannel: true,
      SendMessages: false,
      AddReactions: false
    });
  }

  if (cargos) {
    await cargos.permissionOverwrites.edit(everyone, {
      ViewChannel: true,
      SendMessages: false,
      AddReactions: false,
      ReadMessageHistory: true
    });
  }

  if (avisos) {
    await avisos.permissionOverwrites.edit(everyone, {
      ViewChannel: true,
      SendMessages: false
    });
  }

  for (const channel of [welcome, cargos, avisos]) {
    if (!channel) continue;

    await channel.permissionOverwrites.edit(roles['👑・404 // FOUNDER'], { SendMessages: true });
    await channel.permissionOverwrites.edit(roles['🛡️・404 // ADMIN'], { SendMessages: true });
  }
}

async function publicarWelcome404(guild) {
  const channel = guild.channels.cache.find(c => c.name === '📡・bem-vindo');
  if (!channel) throw new Error('Canal bem-vindo do 404 não encontrado.');

  const imagePath = path.join(process.cwd(), 'assets', 'welcome.png');
  if (!fs.existsSync(imagePath)) throw new Error('assets/welcome.png não encontrado.');

  await limparMensagensBot(channel);

  const image = new AttachmentBuilder(imagePath, { name: '404-welcome.png' });
  await channel.send({ files: [image] });
}

async function publicarCargos404(guild) {
  const channel = guild.channels.cache.find(c => c.name === '🎭・cargos');
  if (!channel) throw new Error('Canal cargos do 404 não encontrado.');

  const imagePath = path.join(process.cwd(), 'assets', 'cargos.png');
  if (!fs.existsSync(imagePath)) throw new Error('assets/cargos.png não encontrado.');

  await limparMensagensBot(channel);

  const image = new AttachmentBuilder(imagePath, { name: '404-cargos.png' });
  await channel.send({ files: [image], components: criarBotoes404() });
}

async function publicarPaineis404(guild) {
  await publicarWelcome404(guild);
  await publicarCargos404(guild);
}

async function setup404(guild) {
  const roles = {};

  for (const [name, color] of roleDefs404) {
    roles[name] = await ensureRole(guild, name, color, '404 Setup');
  }

  for (const [categoryName, children] of categories404) {
    let permissionOverwrites = [];

    if (categoryName === '🔒・404 // BUNKER') {
      permissionOverwrites = [
        { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: roles['⚡・404'].id, allow: [PermissionFlagsBits.ViewChannel] }
      ];
    }

    if (categoryName === '🛡️・STAFF') {
      permissionOverwrites = [
        { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: roles['👑・404 // FOUNDER'].id, allow: [PermissionFlagsBits.ViewChannel] },
        { id: roles['🛡️・404 // ADMIN'].id, allow: [PermissionFlagsBits.ViewChannel] }
      ];
    }

    const category = await ensureCategory(guild, categoryName, permissionOverwrites, '404 Setup');

    for (const [name, type] of children) {
      await ensureChannel(guild, name, type, category, '404 Setup');
    }
  }

  await configurarPermissoes404(guild, roles);
  await publicarPaineis404(guild);
}

/* =========================================================
   MUSH - PERMISSÕES E PAINÉIS
========================================================= */

async function configurarPermissoesMush(guild, roles) {
  const everyone = guild.roles.everyone;
  const staffRoles = [
    roles['👑・MUSH // FOUNDER'],
    roles['🛡️・MUSH // ADMIN'],
    roles['🔧・MUSH // MOD']
  ];

  for (const channelName of readOnlyChannelsMush) {
    const channel = guild.channels.cache.find(c => c.name === channelName);
    if (!channel) continue;

    await channel.permissionOverwrites.edit(everyone, {
      ViewChannel: true,
      SendMessages: false,
      AddReactions: channelName === '🎭・escolha-seus-cargos' ? false : null,
      ReadMessageHistory: true
    });

    for (const role of staffRoles) {
      await channel.permissionOverwrites.edit(role, {
        ViewChannel: true,
        SendMessages: true
      });
    }
  }
}

async function publicarWelcomeMush(guild) {
  const channel = guild.channels.cache.find(c => c.name === '🍄・bem-vindo');
  if (!channel) throw new Error('Canal de boas-vindas do Mush não encontrado.');

  await limparMensagensBot(channel);

  const embed = new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle('🍄 BEM-VINDO AO CLÃ MUSHROOM')
    .setDescription(
      '**Central do clã para Legend of Mushroom.**\n\n' +
      '🎁 Acompanhe os **codes de resgate**\n' +
      '🎉 Veja **eventos e calendário**\n' +
      '🧠 Compartilhe **builds, pets e skills**\n' +
      '🏹 Escolha sua **classe** no painel de cargos\n' +
      '🔊 Entre nas salas para farm, PVE e PVP\n\n' +
      'Comece em **#🎭・escolha-seus-cargos**.'
    )
    .setFooter({ text: 'MUSH // Legend of Mushroom' });

  await channel.send({ embeds: [embed] });
}

async function publicarCargosMush(guild) {
  const channel = guild.channels.cache.find(c => c.name === '🎭・escolha-seus-cargos');
  if (!channel) throw new Error('Canal de cargos do Mush não encontrado.');

  await limparMensagensBot(channel);

  const embed = new EmbedBuilder()
    .setColor(0x57f287)
    .setTitle('🎭 ESCOLHA SEUS CARGOS')
    .setDescription(
      '**Classe — escolha uma:**\n' +
      '🏹 Arqueiro  •  🔮 Mago  •  ⚔️ Guerreiro\n\n' +
      '**Foco — pode marcar mais de um:**\n' +
      '🌲 PVE  •  🏆 PVP\n\n' +
      '**Notificações opcionais:**\n' +
      '🎁 Codes  •  🎉 Eventos\n\n' +
      '_Clique novamente no mesmo botão para remover o cargo._'
    );

  await channel.send({
    embeds: [embed],
    components: criarBotoesMush()
  });
}

async function publicarPaineisMush(guild) {
  await publicarWelcomeMush(guild);
  await publicarCargosMush(guild);
}

async function setupMush(guild) {
  const roles = {};

  for (const [name, color] of roleDefsMush) {
    roles[name] = await ensureRole(guild, name, color, 'Mush Setup');
  }

  for (const [categoryName, children] of categoriesMush) {
    let permissionOverwrites = [];

    if (categoryName === '🔒・MUSH // CLÃ') {
      permissionOverwrites = [
        { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: roles['🍄・MEMBRO DO CLÃ'].id, allow: [PermissionFlagsBits.ViewChannel] },
        { id: roles['👑・MUSH // FOUNDER'].id, allow: [PermissionFlagsBits.ViewChannel] },
        { id: roles['🛡️・MUSH // ADMIN'].id, allow: [PermissionFlagsBits.ViewChannel] },
        { id: roles['🔧・MUSH // MOD'].id, allow: [PermissionFlagsBits.ViewChannel] }
      ];
    }

    if (categoryName === '🛡️・MUSH // STAFF') {
      permissionOverwrites = [
        { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: roles['👑・MUSH // FOUNDER'].id, allow: [PermissionFlagsBits.ViewChannel] },
        { id: roles['🛡️・MUSH // ADMIN'].id, allow: [PermissionFlagsBits.ViewChannel] },
        { id: roles['🔧・MUSH // MOD'].id, allow: [PermissionFlagsBits.ViewChannel] }
      ];
    }

    const category = await ensureCategory(guild, categoryName, permissionOverwrites, 'Mush Setup');

    for (const [name, type] of children) {
      await ensureChannel(guild, name, type, category, 'Mush Setup');
    }
  }

  await configurarPermissoesMush(guild, roles);
  await publicarPaineisMush(guild);
}

/* =========================================================
   BOTÕES - PROCESSAMENTO
========================================================= */

async function removeOtherRoles(member, guild, roleNames, selectedRoleName) {
  for (const otherName of roleNames) {
    if (otherName === selectedRoleName) continue;

    const otherRole = guild.roles.cache.find(role => role.name === otherName);
    if (otherRole && member.roles.cache.has(otherRole.id)) {
      await member.roles.remove(otherRole);
    }
  }
}

async function processarBotaoCargo(interaction) {
  const roleName = buttonRoleMap[interaction.customId];
  if (!roleName) return false;

  const guild = interaction.guild;
  const member = await guild.members.fetch(interaction.user.id);
  const selectedRole = guild.roles.cache.find(role => role.name === roleName);

  if (!selectedRole) {
    await interaction.reply({ content: '❌ Cargo não encontrado.', ephemeral: true });
    return true;
  }

  if (member.roles.cache.has(selectedRole.id)) {
    await member.roles.remove(selectedRole);
    await interaction.reply({ content: `➖ Cargo **${roleName}** removido.`, ephemeral: true });
    return true;
  }

  if (inputRoles404.includes(roleName)) {
    await removeOtherRoles(member, guild, inputRoles404, roleName);
  }

  if (platformRoles404.includes(roleName)) {
    await removeOtherRoles(member, guild, platformRoles404, roleName);
  }

  if (classRolesMush.includes(roleName)) {
    await removeOtherRoles(member, guild, classRolesMush, roleName);
  }

  await member.roles.add(selectedRole);
  await interaction.reply({ content: `✅ Cargo **${roleName}** adicionado.`, ephemeral: true });
  return true;
}

/* =========================================================
   404 - CANAIS SOMENTE COMANDOS/PUBLICAÇÃO
========================================================= */

client.on('messageCreate', async message => {
  if (!message.guild || message.author.bot) return;

  const is404Configured = message.guild.roles.cache.some(role => role.name === '👑・404 // FOUNDER');
  if (!is404Configured) return;
  if (is404Staff(message.member)) return;

  if (commandOnlyChannels404.includes(message.channel.name)) {
    await message.delete().catch(() => {});
    return;
  }

  if (botPublicationChannels404.includes(message.channel.name)) {
    await message.delete().catch(() => {});
  }
});

/* =========================================================
   READY / NOVOS SERVIDORES
========================================================= */

client.once('ready', async () => {
  console.log(`✅ Bot online como ${client.user.tag}`);

  for (const guild of client.guilds.cache.values()) {
    await registerCommandsForGuild(guild);
  }

  console.log('✅ /setup404, /painel404, /setupmush e /painelmush disponíveis.');
});

client.on('guildCreate', async guild => {
  await registerCommandsForGuild(guild);
});

/* =========================================================
   INTERAÇÕES
========================================================= */

client.on('interactionCreate', async interaction => {
  if (interaction.isButton()) {
    try {
      const handled = await processarBotaoCargo(interaction);
      if (!handled) return;
    } catch (error) {
      console.error('Erro no botão:', error);

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '❌ Não consegui alterar seu cargo. Confira se meu cargo está acima dos cargos que eu gerencio.',
          ephemeral: true
        }).catch(() => {});
      }
    }

    return;
  }

  if (!interaction.isChatInputCommand()) return;

  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      content: '❌ Apenas administradores podem usar este comando.',
      ephemeral: true
    });
  }

  if (interaction.commandName === 'setup404') {
    await interaction.deferReply({ ephemeral: true });

    try {
      await setup404(interaction.guild);
      await interaction.editReply(
        '✅ **404 // NO SIGNAL** atualizado.\n\n📡 Welcome publicado\n🎭 Painel com botões publicado\n🔒 Permissões aplicadas'
      );
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        '❌ Erro no setup do 404. Confira os logs e se existem `assets/welcome.png` e `assets/cargos.png`.'
      );
    }

    return;
  }

  if (interaction.commandName === 'painel404') {
    await interaction.deferReply({ ephemeral: true });

    try {
      await publicarPaineis404(interaction.guild);
      await interaction.editReply('✅ Welcome e painel de cargos do 404 republicados.');
    } catch (error) {
      console.error(error);
      await interaction.editReply('❌ Erro publicando os painéis do 404. Confira a pasta `assets`.');
    }

    return;
  }

  if (interaction.commandName === 'setupmush') {
    await interaction.deferReply({ ephemeral: true });

    try {
      await setupMush(interaction.guild);
      await interaction.editReply(
        '✅ **MUSH // Legend of Mushroom** montado.\n\n🍄 Categorias e canais criados\n🎭 Painel de classes publicado\n🎁 Área de codes/eventos criada\n🧠 Builds, pets e skills organizados\n🔒 Áreas do clã e da staff protegidas'
      );
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        '❌ Erro no setup do Mush. Confira se o bot tem **Gerenciar Canais**, **Gerenciar Cargos** e se o cargo do bot está no topo.'
      );
    }

    return;
  }

  if (interaction.commandName === 'painelmush') {
    await interaction.deferReply({ ephemeral: true });

    try {
      await publicarPaineisMush(interaction.guild);
      await interaction.editReply('✅ Painéis do Mush republicados.');
    } catch (error) {
      console.error(error);
      await interaction.editReply('❌ Erro publicando os painéis do Mush.');
    }
  }
});

/* =========================================================
   LOGIN
========================================================= */

client.login(TOKEN);
