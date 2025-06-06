const {Client, Interaction ,ApplicationCommandOptionType, GuildWidgetStyle, AttachmentBuilder} = require('discord.js');
const Level = require('../../models/Level');
const canvacord = require('canvacord');
const calculateLevelXP = require('../../utils/calculateLevelXP');
const { Font, RankCardBuilder } = require('canvacord');
 


module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) =>{
        if(!interaction.inGuild()){
            interaction.reply("You can only run this command inside a server");
            return;
        }

        await interaction.deferReply();
        const mentionUserId = interaction.options.get('target-user')?.value;
        const targetUserId = mentionUserId||interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id,
        });

        if(!fetchedLevel){
            interaction.editReply(
                mentionUserId? `${targetUserObj.user.tag} does not have a level yet. Try again after they chat a little more.`: `You do not have a level yet. Try again after you chat more.`
            
            );
            return;
        }
        let allLevels = await Level.find({guildId: interaction.guild.id}).select('_id userId level xp');
        allLevels.sort((a,b)=>{
            if(a.level === b.level){
                return b.xp - a.xp;
            }else{
                return b.level - a.level;
            }
        });

        let currentRank = allLevels.findIndex((lvl)=>lvl.userId === targetUserId)+1;
        Font.loadDefault();

        const rank = await new RankCardBuilder()
        .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
        .setRank(currentRank)
        .setLevel(fetchedLevel.level)
        .setCurrentXP(fetchedLevel.xp)
        .setRequiredXP(calculateLevelXP(fetchedLevel.level))
        .setStatus(targetUserObj.presence?.status || 'offline')
        //.setProgressBar('#FFC300', 'COLOR')
        .setUsername(targetUserObj.user.username)
        //.setDiscriminator(targetUserObj.user.discriminator)
        .setOverlay('80')
        .setTextStyles({
            level: "LEVEL:", 
            xp: "EXP:", 
            rank: "RANK:",
        });


        const image = await rank.build({ format: 'png',});
        const attachment = new AttachmentBuilder(image);
        interaction.editReply({ files: [attachment] });

        
        
    },


    name: 'level',
    description: "Shows your/someone's level",
    options: [
        {
            name: 'target-user',
            description: 'The user whose level you want to see',
            type: ApplicationCommandOptionType.Mentionable,
        },
    ]
}