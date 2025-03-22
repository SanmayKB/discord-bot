const {Client, Interaction,ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js');


module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async(client, interaction)=>{
        await interaction.deferReply();
        const firstNumber = interaction.options.getInteger('first-number');
        const secondNumber = interaction.options.getInteger('second-number');

        const sum = firstNumber+secondNumber;
        interaction.followUp(`The sum is ${sum}`);
    },

    name:'add',
    description:'adds two numbers.',
    options: [
        {
            name:'first-number',
            description:'The first number to add.',
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name:'second-number',
            description:'The second number to add',
            type:ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    
}