const {Client, Interaction} = require('discord.js');


module.exports ={
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async(client, interaction)=>{
        await interaction.deferReply();

        try {
            const sentGif = await interaction.channel.send({
                files:['src/assets/gifs/coinflip.gif'],
            });
            lastGif = sentGif;
            setTimeout(async ()=>{
                await lastGif.delete();
                lastGif = null;
                const max = 1000;
                const min = 1;
                const headTail = Math.floor(Math.random()*(max - min +1)) + min;
                if(headTail%2 == 0){
                    await interaction.editReply({
                        content: 'Heads',
                        files:['src/assets/images/heads.jpg'],
                    });
                }else{
                    await interaction.editReply({
                        content:'Tails',
                        files: ['src/assets/images/tails.jpg'],
                    })
                }
                
                }, 9000);
        } catch (error) {
            console.log(`Error flipping coin: ${error}.`);
        }

    },
    
    
    name: 'coin-flip',
    description: 'Flips a coin',

}