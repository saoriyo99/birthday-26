import { gameState, ctx, Point, enemyTypes, maps, updateUI, showGameOver, Banana, addSpeechBubble, friendTypes } from '../';

export class Enemy {
    type: string;
    maxHealth: number;
    health: number;
    baseSpeed: number;
    speed: number;
    reward: number;
    socialDamage: number;
    color: string;
    name: string;
    icon: string;
    currentPath: Point[];
    x: number;
    y: number;
    pathIndex: number;
    alive: boolean;
    slowEffect: number;
    stunned: number;
    converted: boolean;
    reachedEnd: boolean;
    grappled: boolean;
    grappleStun: number;
    justDied: boolean = false;

    constructor(type: string) {
        const enemyType = enemyTypes[type];
        this.type = type;

        const healthScale = Math.pow(1.15, gameState.wave - 1);
        this.maxHealth = Math.floor(enemyType.health * healthScale);
        this.health = this.maxHealth;

        this.baseSpeed = enemyType.speed * (1 + (gameState.wave - 1) * 0.03);
        this.speed = this.baseSpeed;
        this.reward = Math.floor(enemyType.reward * (1 + (gameState.wave - 1) * 0.05));
        this.socialDamage = enemyType.socialDamage;
        this.color = enemyType.color;
        this.name = enemyType.name;
        this.icon = enemyType.icon;

        if (gameState.currentMap === null) throw new Error("Current map is not set");
        const currentMap = maps[gameState.currentMap];
        const spawnPoint = currentMap.spawns[Math.floor(Math.random() * currentMap.spawns.length)];
        this.currentPath = currentMap.paths[spawnPoint.pathIndex];

        this.x = spawnPoint.x - 30;
        this.y = spawnPoint.y;
        this.pathIndex = 0;
        this.alive = true;
        this.slowEffect = 0;
        this.stunned = 0;
        this.converted = false;
        this.reachedEnd = false;
        this.grappled = false;
        this.grappleStun = 0;
    }

    update() {
        if (!this.alive || gameState.gameOver) return;

        if (this.stunned > 0) {
            this.stunned -= gameState.gameSpeed;
            return;
        }

        if (this.grappled && this.grappleStun > 0) {
            this.grappleStun -= gameState.gameSpeed;
            if (this.grappleStun <= 0) {
                this.grappled = false;
            }
            return;
        }

        this.speed = this.baseSpeed;
        if (this.slowEffect > 0) {
            this.speed *= 0.3;
            this.slowEffect -= gameState.gameSpeed;
        }

        const currentSpeed = this.speed * gameState.gameSpeed;

        let targetIndex = this.converted ? Math.max(0, this.pathIndex - 1) : this.pathIndex + 1;
        const target = this.currentPath[targetIndex];

        if (!target) {
            if (this.converted) {
                this.alive = false;
                return;
            } else {
                if (!this.reachedEnd) {
                    this.reachedEnd = true;
                    addSpeechBubble(this.x, this.y - 30, `${this.name} drained ${this.socialDamage} social energy!`);
                    gameState.health = Math.max(0, gameState.health - this.socialDamage);
                    if (gameState.health <= 0) {
                        gameState.gameOver = true;
                        showGameOver();
                    }
                    updateUI();
                }
                this.alive = false;
                return;
            }
        }

        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
            if (this.converted) {
                this.pathIndex = Math.max(0, this.pathIndex - 1);
            } else {
                this.pathIndex++;
            }
        } else {
            this.x += (dx / distance) * currentSpeed;
            this.y += (dy / distance) * currentSpeed;
        }
    }

    draw() {
        if (!this.alive) return;

        ctx.fillStyle = this.converted ? '#00ff41' : this.color;
        if (this.type === 'karen' || this.type === 'uberboss' || this.type === 'uncle') {
            ctx.fillRect(this.x - 12, this.y - 12, 24, 24);
        } else {
            ctx.fillRect(this.x - 8, this.y - 8, 16, 16);
        }

        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.icon, this.x, this.y + 4);

        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 12, this.y - 18, 24, 4);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 12, this.y - 18, 24 * healthPercent, 4);

        if (this.slowEffect > 0) {
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - 10, this.y - 10, 20, 20);
        }
        if (this.stunned > 0) {
            ctx.fillStyle = 'yellow';
            ctx.fillText('😵', this.x, this.y - 20);
        }
        if (this.grappled) {
            ctx.strokeStyle = '#795548';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x - 12, this.y - 12, 24, 24);
            ctx.fillStyle = '#795548';
            ctx.fillText('🤼', this.x, this.y - 25);
        }
        if (this.converted) {
            ctx.fillStyle = '#00ff41';
            ctx.fillText('💚', this.x, this.y - 20);
        }
    }

    takeDamage(damage: number, attackerType: string) {
        if (!this.alive || this.converted) return;

        let finalDamage = damage;

        const friendData = friendTypes[attackerType];
        if (friendData) {
            if (friendData.strong.includes(this.type)) {
                finalDamage *= 2;
            } else if (friendData.weak.includes(this.type)) {
                finalDamage *= 0.5;
            }
        }

        this.health -= finalDamage;
        if (this.health <= 0) {
            this.alive = false;
            this.justDied = true;
            gameState.money += this.reward;
            gameState.score += this.reward;
            gameState.totalEnemiesDefeated++;

            for (let i = 0; i < 8; i++) {
                gameState.bananas.push(new Banana(this.x, this.y));
            }

            updateUI();
        }
    }

    applySlow(duration: number) {
        this.slowEffect = Math.max(this.slowEffect, duration);
    }

    stun(duration: number) {
        this.stunned = Math.max(this.stunned, duration);
    }

    convert() {
        this.converted = true;
        this.color = '#00ff41';
    }
}
