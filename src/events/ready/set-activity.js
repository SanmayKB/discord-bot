const{ActivityType} = require('discord.js');


module.exports = (client) =>{
    let statuses = [
        {
            name: "Monster Hunter: Wilds",
            type:ActivityType.Playing,

        },
        {
            name: "Monster Hunter: Rise Sunbreak",
            type:ActivityType.Playing
        },
        {
            name: "Monster Hunter: World Iceborne",
            type:ActivityType.Playing
        },
        {
            name: "Dark Souls: Remasterd",
            type:ActivityType.Playing,
        },
        {
            name: "Touhou: Embodiment of the scarlet devil",
            type: ActivityType.Playing
        },
        {
            name:"Bloodborne",
            type: ActivityType.Playing,
        },
        {
            name:"Metaphor Refantazio",
            type: ActivityType.Playing,
        },
        {
            name:"Tekken 8",
            type: ActivityType.Playing,
        },
        {
            name: "I found the perfect Pirate Game",
            type: ActivityType.Streaming,
            url: "https://www.youtube.com/watch?v=mgyJFyX9caQ"
        },
        {
            name: "Bad Apple",
            type: ActivityType.Streaming,
            url: "https://www.youtube.com/watch?v=9lNZ_Rnr7Jc"
        },
        {
            name: "1st Desire",
            type: ActivityType.Streaming,
            url: "https://www.youtube.com/watch?v=cyOgdHjyNOI",
        }
        
    ]
    let i = Math.floor(Math.random() *statuses.length);
    setInterval(()=>{
        client.user.setActivity(statuses[i]);
        i = Math.floor(Math.random() *statuses.length);
    },30*60*1000);   
    
}