const { description, permissionsRequired } = require("./notification-setup");
const {Client, Interaction, PermissionFlagsBits, ApplicationCommandOptionType} = require('discord.js');
const NotificationConfig = require('../../models/NotificationConfig');


module.exports={
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async(client, interaction)=>{
        try {
            await interaction.deferReply({ephemeral: true});

            const targetYtChannelId = interaction.options.getString('youtube-id');
            const targetNotificationChannel = interaction.options.getChannel('target-channel');

            const targetChannel = await NotificationConfig.findOne({
                ytChannelId:targetYtChannelId,
                notificationChannelId: targetNotificationChannel.id,
            });

            if(!targetChannel){
                interaction.followUp('That youtube channel has not been configured for that channel');
                return;

            } 
            NotificationConfig.findOneAndDelete({
                _id:targetChannel._id,
            }).then(()=>{
                interaction.followUp('Turned off youtube notifications for that channel.');
            }).catch((e)=>{
                interaction.followUp('There was a database error');
            });



        } catch (error) {
            console.log(`Error in ${__filename}:\n`,error);
        }

    },
    name:'notification-disable',
    description: 'disable youtube notifications for a channel',
    permissionsRequired: [PermissionFlagsBits.Administrator],
    options: [
        {
            name:'youtube-id',
            description: 'Channel id of the youtube channel for which you want to disable notifications.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'target-channel',
            description: 'The channel for which you want to disable notifications.',
            type:ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: 'custom-message',
            description: 'Templates: {VIDEO_TITLE} {VIDEO_URL} {CHANNEL_NAME} {CHANNEL_URL}',
            type: ApplicationCommandOptionType.String,
        }
    ]
}