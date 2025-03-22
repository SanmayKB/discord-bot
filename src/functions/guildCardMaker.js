const{createCanvas, loadImage, Canvas} = require('canvas');
const CanvasCustomDraw = require('../utils/CanvasCustomDraw');
const sharp = require('sharp');


module.exports = async function createCard(targetUserObj,targetUserId, allLevels,fetchedUserLevel, cardType){
    
    let currentRank = allLevels.findIndex((lvl)=>lvl.userId === targetUserId)+1;
    const canvas = createCanvas(640,200);
    const ctx = canvas.getContext('2d');
    const avatarURL = targetUserObj.user.displayAvatarURL({format: 'png', size: 128})
    const response = await fetch(avatarURL);
    const buffer = await response.arrayBuffer();
    const pngBuffer = await sharp(Buffer.from(buffer)).toFormat('png').toBuffer();
    const usrName = await targetUserObj.user.username;
    const usrTag = await targetUserObj.user.tag;
    const usrLevel = await fetchedUserLevel.level;
    const usrXp = await fetchedUserLevel.xp;
        

    if(cardType === "regular"){
        ctx.fillStyle = "#B581E9";
        CanvasCustomDraw.drawRoundedRect(ctx,40,0,600,200,25);

        try {     
            const pfp = await loadImage(pngBuffer);
            
            ctx.save(); // Save the current canvas state
            ctx.beginPath();
            ctx.arc(44, 60, 40, 0, Math.PI * 2, true); // (x, y, radius, startAngle, endAngle)
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(pfp,4,20,80,80);

            ctx.restore();


            ctx.beginPath();
            ctx.arc(44, 60, 40, 0, Math.PI*2, true);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.font = "60px 'Times New Roman'";
            ctx.fillStyle = '#41273B';
            ctx.fillText(usrName, 100,80);

            const textMetrics = ctx.measureText(usrName);
            const textWidth = textMetrics.width;

            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(90,100);
            ctx.lineTo(590,100);
            ctx.closePath();
            ctx.stroke();

            ctx.strokeStyle = '#53351C';
            ctx.lineWidth = 10;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(140,140);
            ctx.lineTo(540,130);
            ctx.lineTo(540,170);
            ctx.lineTo(140,160);
            ctx.lineTo(140,140);
            ctx.closePath();
            ctx.stroke();
            ctx.clip();
            ctx.fillStyle = '#A59E9E';
            ctx.fillRect(140,100,400,100);
            ctx.fillStyle = '#4BC3B5';
            ctx.fillRect(140,100,400*usrXp/100,100);

            ctx.restore();

            //rank adding
            const rank = `Rank: ${currentRank}`;
            ctx.font = "30px 'Times New Roman'";
            ctx.fillStyle = '#41273B';
            ctx.fillText(rank, textWidth+100<400?400:textWidth+100,40);

            //level adding
            const levelSentence = `Level: ${usrLevel}`;
            ctx.font = "30px 'Times New Roman'";
            ctx.fillStyle = '#41273B';
            ctx.fillText(levelSentence, textWidth+100<400?400:textWidth+100,80);            
            
        }catch(error){
            console.log(`Error making card: ${error}`);
        }
    }

    return {canvas};
    
};