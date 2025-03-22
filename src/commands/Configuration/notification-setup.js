const { PermissionFlagsBits, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const NotificationConfig = require('../../models/NotificationConfig');
const { google } = require('googleapis');

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
});

module.exports = {
    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        try {
            const targetYtChannelId = interaction.options.getString('youtube-id');
            const targetNotificationChannel = interaction.options.getChannel('target-channel');
            const targetCustomMessage = interaction.options.getString('custom-message');

            const duplicateExists = await NotificationConfig.exists({
                notificationChannelId: targetNotificationChannel.id,
                ytChannelId: targetYtChannelId,
            });

            if (duplicateExists) {
                interaction.followUp('That YouTube channel has already been configured for that channel.\nRun `/notification-disable` first.');
                return;
            }

            // Fetch latest video
            const feed = await youtube.search.list({
                part: 'snippet',
                channelId: targetYtChannelId,
                order: 'date',
                maxResults: 1,
                type: 'video',
            });

            
            const channelDeets = await youtube.channels.list({
                part: 'snippet,statistics',
                id: targetYtChannelId,
            });

            
            if (!channelDeets.data.items || channelDeets.data.items.length === 0) {
                interaction.followUp('Channel not found. Please check the YouTube ID.');
                return;
            }

            const channel = channelDeets.data.items[0];
            const youTubechannelName = channel.snippet.title;

            
            let latestVideo = null;
            if (feed.data.items && feed.data.items.length > 0) {
                latestVideo = feed.data.items[0];
            }

            const notificationConfig = new NotificationConfig({
                guildId: interaction.guildId,
                notificationChannelId: targetNotificationChannel.id,
                ytChannelId: targetYtChannelId,
                customMessage: targetCustomMessage,
                lastChecked: new Date(),
                lastCheckedVid: latestVideo ? {
                    id: latestVideo.id.videoId,
                    pubDate: latestVideo.snippet.publishedAt,
                } : null, 
            });

            await notificationConfig.save();

            const embed = new EmbedBuilder()
                .setTitle('YouTube channel configuration is successful.')
                .setDescription(`${targetNotificationChannel} will now be notified whenever **${youTubechannelName}** uploads.`)
                .setTimestamp();

            interaction.followUp({ embeds: [embed] });

        } catch (error) {
            console.error(`Error in ${__filename}:\n`, error);
            interaction.followUp('An error occurred. Please try again later.');
        }
    },

    name: 'notification-setup',
    description: 'Setup YouTube notifications for a channel',
    permissionsRequired: [PermissionFlagsBits.Administrator],
    options: [
        {
            name: 'youtube-id',
            description: 'The ID of the YouTube channel',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'target-channel',
            description: 'The channel where you want the notification',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: 'custom-message',
            description: 'Templates: {VIDEO_TITLE} {VIDEO_URL} {CHANNEL_NAME} {CHANNEL_URL}',
            type: ApplicationCommandOptionType.String,
        },
    ],
};
