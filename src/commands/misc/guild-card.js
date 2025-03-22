const{Client, Interaction,ApplicationCommandOptionType,AttachmentBuilder, InteractionResponseType} = require('discord.js');
const Level = require('../../models/Level');
const calculateLevelXP = require('../../utils/calculateLevelXP');
const{createCanvas, loadImage} = require('canvas');
const CanvasCustomDraw = require('../../utils/CanvasCustomDraw');
const sharp = require('sharp');
const createGuildCard = require('../../functions/guildCardMaker')



module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */


    callback: async(client, interaction) =>{
        if(!interaction.inGuild()){
            interaction.reply("This is a guild only function");
            return;
        }

        
        await interaction.deferReply();
        const mentionUserId = interaction.options.get('target')?.value;
        const targetUserId = mentionUserId||interaction.member.id;
        const targetUserObj = await interaction.guild.members.fetch(targetUserId);

        const fetchedUserLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id,

        });
        if(!fetchedUserLevel){
            interaction.editReply({
                content: mentionUserId? `${targetUserObj.user.tag} does not have a level yet. Try again after they chat a little more.`: `You do not have a level yet. Try again after you chat more.`,
            });
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
        
    
        try {
            

            const type = "regular";
            const card = await createGuildCard(targetUserObj,targetUserId, allLevels,fetchedUserLevel, type);

            const attach  = new AttachmentBuilder(card.canvas.toBuffer(),{name: 'guildCard.png'});
            await interaction.editReply({files: [attach]});

        } catch (error) {
            console.log(`Error drawing card: ${error}`);
        }

    },
    name: 'guild-card',
    description: 'draws a card',
    options:[
        {
            name: 'target',
            description: 'The target user whose card you wish to draw',
            type: ApplicationCommandOptionType.Mentionable,
        },
    ]
}