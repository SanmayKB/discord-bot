require('dotenv').config();
const {Client, IntentsBitField, EmbedBuilder, Embed, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const roles = [
    {
        id: '1315336190093950976',
        label: 'Valor',
    },
    {
        id: '1315336289112817734',
        label: 'Wisdom',
    }
]

client.on('ready', async(c) =>{
    
    try {
        const channel = await client.channels.cache.get('1314791775608770570');
        if(!channel) return;

        const row = new ActionRowBuilder();

        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder()
                .setCustomId(role.id)
                .setLabel(role.label)
                .setStyle(ButtonStyle.Secondary)
            );
        });

        await channel.send({
            content: 'Add or remove role',
            components: [row]
        });
        process.exit();


    } catch (error) {
        console.log(error);
    }
});


client.login(process.env.TOKEN);