import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';

const TOKEN=process.env.DISCORD_TOKEN, CLIENT_ID=process.env.CLIENT_ID, GUILD_ID=process.env.GUILD_ID;
if(!TOKEN||!CLIENT_ID||!GUILD_ID) throw new Error('Configure DISCORD_TOKEN, CLIENT_ID e GUILD_ID.');
const client=new Client({intents:[GatewayIntentBits.Guilds]});
const command=new SlashCommandBuilder().setName('setup404').setDescription('Monta a estrutura oficial do 404').setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
const rest=new REST({version:'10'}).setToken(TOKEN);

const roleDefs=[
 ['━━━「 404 STAFF 」━━━',0x2b2d31],['👑・404 // FOUNDER',0x8e44ad],['🛡️・404 // ADMIN',0x71368a],
 ['━━━「 404 CREW 」━━━',0x2b2d31],['⚡・404',0x9b59b6],['🤝・ALIADO',0x95a5a6],
 ['━━━「 INPUT 」━━━',0x2b2d31],['🎮・CONTROLE',0x5865f2],['⌨️・MOUSE & KEYBOARD',0x99aab5],
 ['━━━「 PLATFORM 」━━━',0x2b2d31],['🖥️・PC',0x99aab5],['🟦・PLAYSTATION',0x3498db],['🟩・XBOX',0x57f287],['☁️・GEFORCE NOW',0x2ecc71],
 ['━━━「 GAME MODES 」━━━',0x2b2d31],['🪂・WARZONE',0xe67e22],['🏆・RANKED',0xf1c40f],['💥・MULTIPLAYER',0xe74c3c],['🧟・ZOMBIES',0x57f287],
 ['━━━「 SYSTEM 」━━━',0x2b2d31],['🤖・BOTS',0x5865f2]
];
const categories=[
 ['👾・START HERE',[['📡・bem-vindo','text'],['🎭・cargos','text'],['📢・avisos','text']]],
 ['💬・404 // QG',[['💬・geral','text'],['😂・memes','text'],['📸・clips-e-highlights','text'],['🤖・comandos','text']]],
 ['🔫・404 // CALL OF DUTY',[['🎯・cod','text'],['🔫・loadouts','text'],['🏆・ranked','text'],['📊・stats','text'],['📰・updates','text']]],
 ['🎮・404 // GAMING',[['🎮・outros-jogos','text'],['🔎・bora-jogar','text']]],
 ['🔊・404 // COMMS',[['🔊・Lobby','voice'],['☢️・Warzone','voice'],['🏆・Ranked','voice'],['🍻・Resenha','voice']]],
 ['🔒・404 // BUNKER',[['💬・clã','text'],['🎯・estratégias','text'],['📅・marcar-jogatina','text'],['🔊・Bunker 404','voice']]],
 ['🛡️・STAFF',[['⚙️・staff','text'],['📋・logs','text']]]
];
async function role(g,name,color){let r=g.roles.cache.find(x=>x.name===name); if(!r) r=await g.roles.create({name,color,reason:'404 Setup'}); return r;}
async function chan(g,name,type,parent,overwrites){let c=g.channels.cache.find(x=>x.name===name&&x.parentId===parent?.id); if(!c)c=await g.channels.create({name,type:type==='voice'?ChannelType.GuildVoice:ChannelType.GuildText,parent:parent?.id,permissionOverwrites:overwrites,reason:'404 Setup'});return c;}
async function setup(g){
 const roles={}; for(const [n,c] of roleDefs) roles[n]=await role(g,n,c);
 const everyone=g.roles.everyone;
 for(const [catName,children] of categories){
   let overwrites=[];
   if(catName==='🔒・404 // BUNKER') overwrites=[{id:everyone.id,deny:[PermissionFlagsBits.ViewChannel]},{id:roles['⚡・404'].id,allow:[PermissionFlagsBits.ViewChannel]}];
   if(catName==='🛡️・STAFF') overwrites=[{id:everyone.id,deny:[PermissionFlagsBits.ViewChannel]},{id:roles['👑・404 // FOUNDER'].id,allow:[PermissionFlagsBits.ViewChannel]},{id:roles['🛡️・404 // ADMIN'].id,allow:[PermissionFlagsBits.ViewChannel]}];
   let cat=g.channels.cache.find(x=>x.name===catName&&x.type===ChannelType.GuildCategory);
   if(!cat) cat=await g.channels.create({name:catName,type:ChannelType.GuildCategory,permissionOverwrites:overwrites,reason:'404 Setup'});
   for(const [n,t] of children) await chan(g,n,t,cat,[]);
 }
 const welcome=g.channels.cache.find(x=>x.name==='📡・bem-vindo');
 if(welcome) await welcome.send('## 404 // NO SIGNAL\n**WELCOME, OPERATOR.**\n\nBem-vindo ao QG do **404**. Ajuste seus cargos de input, plataforma e modos no onboarding do servidor e entre na call.\n\n`NO SIGNAL. ONLY SKILL.`').catch(()=>{});
 const cargos=g.channels.cache.find(x=>x.name==='🎭・cargos');
 if(cargos) await cargos.send('## 404 // IDENTIFICAÇÃO\n**INPUT** — 🎮 Controle / ⌨️ Mouse & Keyboard\n**PLATAFORMA** — 🖥️ PC / 🟦 PlayStation / 🟩 Xbox / ☁️ GeForce NOW\n**GAME MODES** — 🪂 Warzone / 🏆 Ranked / 💥 Multiplayer / 🧟 Zombies\n\nEsses cargos foram preparados para serem vinculados ao **Onboarding/Canais e Cargos** nativo do Discord.').catch(()=>{});
 return roles;
}
client.once('ready',async()=>{console.log(`404 Setup online como ${client.user.tag}`);await rest.put(Routes.applicationGuildCommands(CLIENT_ID,GUILD_ID),{body:[command.toJSON()]});console.log('/setup404 registrado.');});
client.on('interactionCreate',async i=>{if(!i.isChatInputCommand()||i.commandName!=='setup404')return;if(i.guildId!==GUILD_ID)return i.reply({content:'Este bot está limitado ao servidor 404.',ephemeral:true});await i.deferReply({ephemeral:true});try{await setup(i.guild);await i.editReply('✅ Estrutura **404 // NO SIGNAL** criada. Agora configure o Onboarding nativo vinculando os cargos de INPUT, PLATFORM e GAME MODES.');}catch(e){console.error(e);await i.editReply('❌ Erro no setup. Confira se o bot tem **Administrador** e se o cargo dele está alto o suficiente.');}});
client.login(TOKEN);
