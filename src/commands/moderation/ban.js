const {Client, Interaction ,ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) =>{
        const targetUserId = interaction.options.get('target-user').value;
        const reason = interaction.options.get('reason')?.value || 'No reason provided.';

        await interaction.deferReply();
        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if(!targetUser){
            await interaction.editReply("That user doesn't exist in this server");
            return;
        }
        
        if(targetUser.id === interaction.guild.ownerId){
            await interaction.editReply("Cannot ban Owner of this server");
        }

        const targetUserRolePosition = targetUser.roles.highest.position;// highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position;//higest role of the user asking for the ban
        const botRolePosition = interaction.guild.members.me.roles.highest.position;//highest role of the bot

        if(targetUserRolePosition >= requestUserRolePosition){
            await interaction.editReply("You cannot ban that user because they have the same/higher role than you");
            return;
        }
        if(targetUserRolePosition >= botRolePosition){
            await interaction.editReply("I cannot ban that member since they have the same or higher role than me");
            return;
        }

        //ban the target user

        try {
            await targetUser.ban({reason});
            await interaction.editReply(
                `User ${targetUser} was banned.\nReason: ${reason}`
            );
        } catch (error) {
            console.log(`There was an error while trying to ban the user: ${error}`);
        }
    },

    name: 'ban',
    description: 'Bans a member from this server.',
    //devOnly: Boolean,
    // testOnly: Boolean,
    //options: Object[],

    options: [
        {
            name: 'target-user',
            description: 'The user you want to ban',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'The reason for the ban',
            type: ApplicationCommandOptionType.String,
        },
    ],

    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions:[PermissionFlagsBits.BanMembers],

    
}