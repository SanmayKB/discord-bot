require('dotenv').config();
const {Client, IntentsBitField, EmbedBuilder, Embed} = require('discord.js');

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

client.on('messageCreate', (message)=>{
    if(message.author.bot){
        return;
    }
    if(message.content === 'Hey Kettle'){
        message.reply('Hey!');
    }
});

client.on('interactionCreate', (interaction) =>{
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName === 'add'){
        const num1 = interaction.options.get('first-number').value;
        const num2 = interaction.options.get('second-number').value;
        
        interaction.reply(`Sum: ${num1 + num2}`);
    }

    if(interaction.commandName === 'multiply'){
        const num1 = interaction.options.get('first-number').value;
        const num2 = interaction.options.get('second-number').value;
        interaction.reply(`product: ${num1 * num2}`);
    }
    if(interaction.commandName === 'embed'){
        const embed = new EmbedBuilder()
        .setTitle('This is the embed title')
        .setDescription('This is the description')
        .setColor(0x121212)
        .setAuthor({name:'Link', iconURL:'https://lh3.googleusercontent.com/5G-1E-QhiwLFrlJvl68PtEjOzfIUrP8kalXOP8YrNoLHE4T4pP4ovzi2iOjmu_z5_-TqklO0Dmy1qNXkuWNrGvTO=s1280-w1280-h800', url: 'https://youtu.be/u5_a-lQlv6A?list=PLpmb-7WxPhe0ZVpH9pxT5MtC4heqej8Es'})
        .setThumbnail('https://lh3.googleusercontent.com/5G-1E-QhiwLFrlJvl68PtEjOzfIUrP8kalXOP8YrNoLHE4T4pP4ovzi2iOjmu_z5_-TqklO0Dmy1qNXkuWNrGvTO=s1280-w1280-h800')
        .addFields({
            name: 'Link\'s Field 1', 
            value: 'Hello there', 
            inline: true
        },
        {
            name: 'Link\'s Field 2',
            value: 'Good day we are having',
            inline: true
        },
        {
            name: '3rd field',
            value: '234',

        },
        {
            name: '4th field', 
            value: '5435', 
        }
    
        );

        interaction.reply({embeds: [embed]});
    }
});

client.login(process.env.TOKEN);