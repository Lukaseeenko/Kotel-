const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
} = require('@discordjs/voice');
const express = require('express');
const app = express();

// Token z environment variable
const token = process.env.TOKEN;

// Vytvoření bota
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ]
});

// Seznam cen
const prizes = [
  "DNESKA NIC!",
  "hellcase",
  "csgo.net",
  "farmskins",
  "casehug"
];

// Seznam odkazů na stránky
const links = {
  'hellcase': 'https://hellcase.com',
  'csgo.net': 'https://csgo.net',
  'farmskins': 'https://farmskins.com',
  'casehug': 'https://casehug.com'
};

// Když je bot připraven
client.once('ready', () => {
  console.log('✅ Bot je připojený a připravený!');
});

// Zpracování zprávy
client.on('messageCreate', async (message) => {
  if (message.content === '!kotel') {
    const voiceChannel = message.member.voice.channel;

    // Zkontrolovat, jestli uživatel je v voice kanálu
    if (!voiceChannel) {
      return message.reply('Musíš být připojený do voice kanálu, aby ses mohl zúčastnit!');
    }

    // Získání seznamu členů kanálu, kteří nejsou boti
    const members = voiceChannel.members.filter(member => !member.user.bot).map(member => member.displayName);

    // Pokud není nikdo v kanálu, zobrazí zprávu
    if (members.length === 0) {
      return message.reply('V místnosti není žádný účastník.');
    }

    try {
      // Počáteční zpráva pro spin
      const spinMessage = await message.channel.send('🎡 Kotel se připravuje na točení...');

      // Točení kotle (počítání do 5)
      for (let i = 5; i >= 1; i--) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await spinMessage.edit(`🎡 Kotel se točí za... ${i} sek${i === 1 ? 'undu' : 'undy'}!`);
      }

      // Příprava na výběr výherce
      await spinMessage.edit('🎡 Kotel se točí...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await spinMessage.edit('🎡 Kotel je téměř na konci...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Výběr výherce a ceny
      const winner = members[Math.floor(Math.random() * members.length)];
      const prize = prizes[Math.floor(Math.random() * prizes.length)];

      // Zpracování výherní ceny
      if (prize === "DNESKA NIC!") {
        await spinMessage.edit(`🎡 Kotel se zastavil... a dnešním točařem je: ${winner} 🎉\nDnes máš šťastný den – žádné dobíjení!`);
        await message.channel.send('😞 Je mi na hovno, že dnes nebudem dělat společně točky!');
      } else {
        const link = links[prize];
        const dollars = Math.floor(Math.random() * 91) + 10;
        await spinMessage.edit(`🎡 Kotel se zastavil... a dnešním točařem je: ${winner} :fire: \nDnes budeš na stránce: **${prize}**! :ninja: \n${winner}, pro tuto stránku máš dobít ${dollars} dolaru! 💰\nTu máš odkaz na stránku: ${link}`);
        await message.channel.send(`${winner}, přeji ti hodně štěstí při výhře! :dagger:  
  Pokud si vytočíš skiny a pošleš je na svůj Steam, nezapomeň udělat screenshot a poslat ho do místnosti - Skiny z kotle! :money_with_wings:`);
      }

    } catch (error) {
      console.error('Chyba při provádění akce:', error);
      message.channel.send('Došlo k chybě při provádění akce.');
    }
  }
});

// Připojení k Discordu
client.login(token);

// Webový server pro testování
app.get('/', (req, res) => {
  res.send('Bot běží!');
});

// Web server naslouchá na portu 3000
app.listen(3000, () => {
  console.log('🌐 Web server běží na portu 3000');
});

// Zpracování nečekaných chyb a odmítnutí promís
process.on('uncaughtException', (err) => {
  console.error('Nepodařilo se zpracovat chybu: ', err);
  process.exit(1); // Zavřít aplikaci při nečekané chybě
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Nezpracovaný odmítnutý promise: ', reason);
});

