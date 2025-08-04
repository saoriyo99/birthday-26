import { gameState, ctx, Point, Enemy, Banana, addSpeechBubble, friendTypes } from '../';

export class Train {
    x: number;
    y: number;
    speed: number;
    damage: number;
    width: number;
    height: number;
    life: number;
    maxLife: number;
    hitEnemies: Set<Enemy>;
    path: Point[] | null;
    nextWaypoint: number;
    pathComplete: boolean;
    goingBackwards: boolean;

    constructor(startX: number, startY: number) {
        this.x = startX;
        this.y = startY;
        this.speed = 4;
        this.damage = 80;
        this.width = 60;
        this.height = 40;
        this.life = 200;
        this.maxLife = 300;
        this.hitEnemies = new Set();
        this.path = null;
        this.nextWaypoint = 0;
        this.pathComplete = false;
        this.goingBackwards = false;
    }

    update() {
        this.life -= gameState.gameSpeed;

        if (this.path && !this.pathComplete) {
            const target = this.path[this.nextWaypoint];

            if (target) {
                const dx = target.x - this.x;
                const dy = target.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 8) {
                    if (this.goingBackwards) {
                        this.nextWaypoint--;
                        if (this.nextWaypoint < 0) {
                            this.pathComplete = true;
                        }
                    } else {
                        this.nextWaypoint++;
                        if (this.nextWaypoint >= this.path.length) {
                            this.pathComplete = true;
                        }
                    }
                } else {
                    const moveSpeed = this.speed * gameState.gameSpeed;
                    this.x += (dx / distance) * moveSpeed;
                    this.y += (dy / distance) * moveSpeed;
                }
            }
        }

        for (let enemy of gameState.enemies) {
            if (!enemy.alive || enemy.converted || this.hitEnemies.has(enemy)) continue;

            const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
            if (distance < 30) {
                this.hitEnemies.add(enemy);
                enemy.takeDamage(this.damage, 'train');
                addSpeechBubble(enemy.x, enemy.y - 30, "CHOO CHOO! 🚂");

                for (let i = 0; i < 12; i++) {
                    gameState.bananas.push(new Banana(enemy.x, enemy.y));
                }
            }
        }
    }

    draw() {
        if (this.life <= 0) return;

        const alpha = Math.min(1, this.life / 60);
        ctx.globalAlpha = alpha;

        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🚂', this.x, this.y + 7);

        let trailDx = 15, trailDy = 0;

        if (this.path && this.nextWaypoint >= 0 && this.nextWaypoint < this.path.length) {
            const target = this.path[this.nextWaypoint];
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                trailDx = -(dx / distance) * 20;
                trailDy = -(dy / distance) * 20;
            }
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '16px Arial';
        for (let i = 0; i < 3; i++) {
            const trailX = this.x + trailDx * (i + 1) + (Math.random() * 10 - 5);
            const trailY = this.y + trailDy * (i + 1) + (Math.random() * 10 - 5);
            ctx.fillText('💨', trailX, trailY);
        }

        ctx.globalAlpha = 1;
    }

    isAlive() {
        return this.life > 0 && !this.pathComplete;
    }
}
