const {Client, IntentsBitField} = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) =>{
    console.log(`${c.user.tag} is online`);
});

client.login('MTMxNDc4OTMyNzIxNzEwMjg5OQ.GELu60.VXOWRtewBENpjIS3_BjrpV62-03-Fbcfp_NqL8');