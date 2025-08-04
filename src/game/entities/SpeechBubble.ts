import { gameState, ctx } from '../';

export class SpeechBubble {
    x: number;
    y: number;
    message: string;
    life: number;
    maxLife: number;

    constructor(x: number, y: number, message: string) {
        this.x = x;
        this.y = y;
        this.message = message;
        this.life = 180; // 3 seconds at 60fps
        this.maxLife = 180;
    }

    update() {
        this.life -= gameState.gameSpeed;
    }

    draw() {
        if (this.life <= 0) return;

        const alpha = Math.min(1, this.life / 60);
        ctx.globalAlpha = alpha;

        const fontSize = 12;
        ctx.font = `${fontSize}px Courier New`;
        ctx.textBaseline = 'top';
        const textColor = '#00ff41';
        const bgColor = 'rgba(0,0,0,0.9)';
        const borderColor = '#00ff41';
        const padding = 8;
        const pointerH = 10;
        const maxBubbleWidth = 200;

        const words = this.message.split(' ');
        const lines: string[] = [];
        let line = '';

        for (let word of words) {
            const testLine = line ? (line + ' ' + word) : word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width + padding * 2 > maxBubbleWidth) {
                if (line) lines.push(line);
                line = word;
            } else {
                line = testLine;
            }
        }
        if (line) lines.push(line);

        let bubbleWidth = 0;
        for (let l of lines) {
            const w = ctx.measureText(l).width;
            if (w > bubbleWidth) bubbleWidth = w;
        }
        bubbleWidth += padding * 2;
        const lineHeight = fontSize * 1.2;
        const bubbleHeight = lines.length * lineHeight + padding * 2;

        const halfW = bubbleWidth / 2;
        let bx = this.x;
        if (bx - halfW < 0) bx = halfW;
        else if (bx + halfW > ctx.canvas.width) bx = ctx.canvas.width - halfW;

        let by = this.y - pointerH - bubbleHeight;
        if (by < 0) by = 0;
        else if (by + bubbleHeight + pointerH > ctx.canvas.height) {
            by = ctx.canvas.height - bubbleHeight - pointerH;
        }

        ctx.fillStyle = bgColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.fillRect(bx - halfW, by, bubbleWidth, bubbleHeight);
        ctx.strokeRect(bx - halfW, by, bubbleWidth, bubbleHeight);

        const px = this.x;
        const py = by + bubbleHeight;
        ctx.beginPath();
        ctx.moveTo(px - pointerH, py);
        ctx.lineTo(px, py + pointerH);
        ctx.lineTo(px + pointerH, py);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        for (let i = 0; i < lines.length; i++) {
            const textX = bx;
            const textY = by + padding + i * lineHeight;
            ctx.fillText(lines[i], textX, textY);
        }

        ctx.globalAlpha = 1;
    }
}
