const{Client, Interaction, PermissionFlagsBits} = require('discord.js');
const AutoRole = require('../../models/AutoRole');
const { botPermissions } = require('./autorole-configure');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async(client, interaction)=>{
        try {
            await interaction.deferReply();
            if(!(await AutoRole.exists({guildId: interaction.guild.id}))){
                interaction.editReply("Auto role has not been set up in this server. Use '/autorole-configure' command to set it up.");
                return;
            }
            await AutoRole.findOneAndDelete({guildId: interaction.guild.id});
            interaction.editReply("Auto role has been disable for this server. Use '/autorole-configure' command to set it back up.");
             
        } catch (error) {
            console.log(`Error disabling auto role: ${error}.`);

        }
    },
    name: 'autorole-disable',
    description: 'Disable auto role functionality in this server.',
    permissionsRequired: [PermissionFlagsBits.Administrator],
}