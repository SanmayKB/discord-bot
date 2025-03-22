const {ApplicationCommandOptionType, Client, Interaction, PermissionFlagsBits} = require('discord.js');
const AutoRole = require('../../models/AutoRole');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction)=>{
        if(!interaction.inGuild()){
            interaction.reply("You can only run this command in a server.");
            return;
        }
        const targetRoleId = interaction.options.get('role').value;

        try {
            await interaction.deferReply();

            let autoRole = await AutoRole.findOne({guildId: interaction.guild.id});

            if(autoRole){
                if(autoRole.roleId === targetRoleId){
                    interaction.editReply("Auto role has already been configured for that role. To disble run '/autorole-disable'.");
                    return;
                }
                autoRole.roleId = targetRoleId;
            }else{
                autoRole = new AutoRole({
                    guildId: interaction.guild.id,
                    roleId: targetRoleId,
                });
            }


            await autoRole.save();
            interaction.editReply("Auto Role has now been configured. To disable, run '/autorole-disable' command.");
        } catch (error) {
            console.log(`Error configuring auto-role: ${error}.`);
        }
    },

    name: 'autorole-configure',
    description: 'Configure your auto-role for this server',
    options: [
        {
            name: 'role',
            description: 'The role you want users to get', 
            type: ApplicationCommandOptionType.Role,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.ManageRoles],
}