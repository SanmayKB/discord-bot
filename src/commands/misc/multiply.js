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

        const product = firstNumber*secondNumber;
        interaction.followUp(`The product is ${product}`);
    },

    name:'multiply',
    description:'multiplies two numbers.',
    options: [
        {
            name:'first-number',
            description:'The first number to multiply.',
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name:'second-number',
            description:'The second number to multiply',
            type:ApplicationCommandOptionType.Integer,
            required: true,
        }
    ],
    
}