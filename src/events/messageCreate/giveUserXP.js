const {Client, Message} = require('discord.js');
const calculateLevelXP = require('../../utils/calculateLevelXP.js');
const Level = require('../../models/Level.js')

function getRandomXP(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random()*(max - min +1)) + min;
}



/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

 module.exports = async (client, message) =>{
    if(!message.inGuild()||message.author.bot) return;

    const xpToGive = getRandomXP(5,15);
    const query ={
        userId: message.author.id,
        guildId: message.guild.id,
    };
    try {
        const level = await Level.findOne(query);
        if(level){
            level.xp +=xpToGive;

            if(level.xp > calculateLevelXP(level.level)){
                level.xp = 0;
                level.level += 1;
                message.channel.send(`${message.member} you have levelled up! Your current level is ${level.level}`);
            }
            await level.save().catch((e)=>{
                console.log(`error while saving level: ${e}`);
                return;
            });
        }
        //if(!level)
        else{
            //create new level
            const newLevel =  new Level({
                userId: message.author.id,
                guildId: message.guild.id,
                xp: xpToGive,
                
            });

            await newLevel.save().catch((e) =>{
                console.log(`Error while saving new level: ${e}`);
            })
        }

    } catch (error) {
        console.log(`There was an error giving XP: ${error}`);
    }

 }