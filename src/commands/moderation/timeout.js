const {Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js');
const ms = require('ms');
const { permissionsRequired, botPermissions, callback } = require('./ban');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const mentionable = interaction.options.get('target-user').value;
        const duration = interaction.options.get('duration').value;
        const reason = interaction.options.get('reason')?.value || 'No reason provided.';

        await interaction.deferReply();

        const targetUser = interaction.guild.members.fetch(mentionable);

        

        if(!targetUser){
            await interaction.editReply("The user is no longer in the server.");
            return;
        }

        if((await targetUser).user.bot){
            await interaction.editReply("I cannot timeout a bot.");
            return;
        }

        const msDuration = ms(duration);
        if(isNaN(msDuration)){
            await interaction.editReply("The Duration is invalid. Please enter a valid interval, ie. 5s, 4d etc.");
            return;
        }
        
        if(msDuration<5000 || msDuration>2.419e9){
            await interaction.editReply("Timeout duration cannot be less than 5 seconds or more than 28 days.");
            return;
        }

        const targetUserRolePosition = (await targetUser).roles.highest.position;// highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position;//higest role of the user asking for the ban
        const botRolePosition = interaction.guild.members.me.roles.highest.position;//highest role of the bot

        if(targetUserRolePosition >= requestUserRolePosition){
            await interaction.editReply("You cannot timeout that member because they have the same/higher role than you");
            return;
        }
        if(targetUserRolePosition >= botRolePosition){
            await interaction.editReply("I cannot timeout that member since they have the same or higher role than me");
            return;
        }

        try {
            const {default: prettyMs} = await import('pretty-ms');
            if((await targetUser).isCommunicationDisabled()){
                (await targetUser).timeout(msDuration, reason);
                await interaction.editReply(`${targetUser}'s timeout has been updated to ${prettyMs(msDuration, {verbose: true})}\nReason: ${reason}`);
                return;
            }

            (await targetUser).timeout(msDuration, reason);
            await interaction.editReply(`${targetUser} was timed out for ${prettyMs(msDuration, {verbose: true})}\nReason: ${reason}`);
        } catch (error) {
            console.log(`There was an error while trying to timeout the user: ${error}`);
            
        }
    },

    name: 'timeout', 
    description: 'Timeout a user',
    options: [
        {
            name: 'target-user',
            description: 'The user you want to timeout.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'duration',
            description: 'Duration of the timeout.(30m, 1h, 2 days)',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason for the timeout',
            type: ApplicationCommandOptionType.String,
        },
    ],

    permissionsRequired: [
        PermissionFlagsBits.MuteMembers
    ],
    botPermissions: [
        PermissionFlagsBits.MuteMembers
    ],
}