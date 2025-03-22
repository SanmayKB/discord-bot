const NotificationConfig = require('../../models/NotificationConfig');
const { google } = require('googleapis');

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
});

/**
 * @param {import('discord.js').Client} client
 */
module.exports = (client) => {
    checkYoutube();
    setInterval(checkYoutube, 600_000);

    async function checkYoutube() {
        try {
            const notificationConfigs = await NotificationConfig.find();
            console.log("Checking for YouTube uploads...");

            for (const notificationConfig of notificationConfigs) {  // ✅ Fixed loop

                const feed = await youtube.search.list({
                    part: 'snippet',
                    channelId: notificationConfig.ytChannelId,
                    order: 'date',
                    maxResults: 1,
                    type: 'video',
                });

                if (!feed.data.items || feed.data.items.length === 0) continue;  

                const latestVideo = feed.data.items[0];
                const latestCheckedVideo = notificationConfig.lastCheckedVid;

                
                if (
                    !latestVideo ||
                    (latestCheckedVideo &&
                        latestVideo.id.videoId === latestCheckedVideo.id &&
                        new Date(latestVideo.snippet.publishedAt) <= new Date(latestCheckedVideo.pubDate))
                ) {
                    continue;
                }

                const targetGuild =
                    client.guilds.cache.get(notificationConfig.guildId) ||
                    (await client.guilds.fetch(notificationConfig.guildId).catch(() => null));

                if (!targetGuild) {
                    await NotificationConfig.findOneAndDelete({ _id: notificationConfig._id });
                    continue;
                }

                const targetChannel =
                    targetGuild.channels.cache.get(notificationConfig.notificationChannelId) ||
                    (await targetGuild.channels.fetch(notificationConfig.notificationChannelId).catch(() => null));

                if (!targetChannel) {
                    await NotificationConfig.findOneAndDelete({ _id: notificationConfig._id });
                    continue;
                }

                
                notificationConfig.lastCheckedVid = {
                    id: latestVideo.id.videoId,
                    pubDate: latestVideo.snippet.publishedAt,
                };

                const videoUrl = `https://www.youtube.com/watch?v=${latestVideo.id.videoId}`;

                await notificationConfig.save();

                const targetMessage =
                    notificationConfig.customMessage
                        ?.replace('{VIDEO_URL}', videoUrl)
                        ?.replace('{VIDEO_TITLE}', latestVideo.snippet.title)
                        ?.replace('{CHANNEL_URL}', `https://www.youtube.com/channel/${notificationConfig.ytChannelId}`)
                        ?.replace('{CHANNEL_NAME}', latestVideo.snippet.channelTitle) // ✅ Fixed `channelTitle`
                    || `New upload by **${latestVideo.snippet.channelTitle}**\n${videoUrl}`;

                targetChannel.send(targetMessage);
            }
        } catch (error) {
            console.log(`Error in ${__filename}:\n`, error);
        }
    }
};
