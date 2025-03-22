//const{}
const sharp = require('sharp');
const {LoadImage} = require('canvas');

class CanvasCustomDraw{
    static drawRoundedRect(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.arc(x + width - radius, y + radius, radius, -Math.PI / 2, 0);
            ctx.lineTo(x + width, y + height - radius);
            ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2);
            ctx.lineTo(x + radius, y + height);
            ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI);
            ctx.lineTo(x, y + radius);
            ctx.arc(x + radius, y + radius, radius, Math.PI, (Math.PI * 3) / 2);
            ctx.closePath();
            ctx.fill(); // Fill the rectangle
    }
    
}
module.exports = CanvasCustomDraw;