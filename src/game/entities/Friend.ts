import { gameState, ctx, FriendStats, friendTypes, Enemy, Projectile, addSpeechBubble } from '../';

export class Friend {
    x: number;
    y: number;
    type: string;
    stats: FriendStats;
    lastShot: number;
    target: Enemy | null;
    specialCooldown: number;
    upgrades: string[];
    experienceLevel?: number;
    maxExperience?: number;
    experienceGainRate?: number;
    grappledEnemies?: { enemy: Enemy, duration: number }[];

    constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.stats = JSON.parse(JSON.stringify(friendTypes[type]));
        this.lastShot = 0;
        this.target = null;
        this.specialCooldown = 0;
        this.upgrades = [];

        if (type === 'maddie') {
            this.experienceLevel = 0;
            this.maxExperience = 10;
            this.experienceGainRate = 1;
        }
        if (type === 'oise') {
            this.grappledEnemies = [];
        }
    }

    update() {
        if (gameState.gameOver) return;

        if (this.type === 'maddie') {
            this.updateMaddieExperience();
        }

        if (this.type === 'oise') {
            this.updateOiseGrappling();
        }

        this.target = null;
        let closestDistance = this.stats.range;

        for (let enemy of gameState.enemies) {
            if (!enemy.alive || enemy.converted) continue;

            const distance = Math.sqrt(
                (enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2
            );

            if (distance < closestDistance) {
                this.target = enemy;
                closestDistance = distance;
            }
        }

        const adjustedFireRate = this.stats.fireRate / gameState.gameSpeed;
        if (this.target && Date.now() - this.lastShot > adjustedFireRate) {
            this.attack();
            this.lastShot = Date.now();
        }

        if (this.specialCooldown > 0) this.specialCooldown -= gameState.gameSpeed;
        this.useSpecialAbility();
    }

    updateMaddieExperience() {
        if (this.type !== 'maddie' || this.experienceLevel === undefined || this.maxExperience === undefined) return;

        const experienceRadius = 150;
        let newExperience = 0;

        for (let enemy of gameState.enemies) {
            if (enemy.justDied) {
                const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
                if (distance < experienceRadius) {
                    newExperience += (this.experienceGainRate || 1);
                }
            }
        }

        if (newExperience > 0 && this.experienceLevel < this.maxExperience) {
            this.experienceLevel = Math.min(this.maxExperience, this.experienceLevel + newExperience);

            const baseDamage = friendTypes.maddie.damage;
            const experienceMultiplier = 1 + (this.experienceLevel * 0.15);
            this.stats.damage = Math.floor(baseDamage * experienceMultiplier);

            if (this.experienceLevel === this.maxExperience) {
                addSpeechBubble(this.x, this.y - 30, "Maddie graduated! 🎓");
            }
        }
    }

    updateOiseGrappling() {
        if (this.type !== 'oise' || !this.grappledEnemies) return;

        this.grappledEnemies = this.grappledEnemies.filter(grapple => {
            if (!grapple.enemy.alive) return false;

            grapple.duration -= gameState.gameSpeed;
            if (grapple.duration <= 0) {
                grapple.enemy.grappled = false;
                return false;
            }
            return true;
        });
    }

    attack() {
        if (!this.target) return;

        if ((this.stats.special === 'slow_only' || this.stats.special === 'conspiracy_only') &&
            !this.upgrades.includes('damage')) {
            return;
        }

        if (this.stats.special.includes('wide') && this.upgrades.includes('wide')) {
            this.wideshotAttack();
        } else {
            gameState.projectiles.push(new Projectile(
                this.x, this.y, this.target, this.stats.damage, this.type
            ));
        }
    }

    wideshotAttack() {
        const effectiveRange = this.stats.range + (this.upgrades.includes('wide') ? 50 : 0);
        for (let enemy of gameState.enemies) {
            if (!enemy.alive || enemy.converted) continue;

            const distance = Math.sqrt(
                (enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2
            );

            if (distance <= effectiveRange) {
                gameState.projectiles.push(new Projectile(
                    this.x, this.y, enemy, this.stats.damage, this.type
                ));
            }
        }
    }

    useSpecialAbility() {
        if (this.specialCooldown > 0) return;

        switch (this.stats.special) {
            case 'listener':
                const healAmount = this.upgrades.includes('heal') ? 400 : 200;
                for (let friend of gameState.friends) {
                    const distance = Math.sqrt((friend.x - this.x) ** 2 + (friend.y - this.y) ** 2);
                    if (distance < 100 && friend !== this) {
                        friend.lastShot = Math.max(0, friend.lastShot - healAmount);
                    }
                }
                this.specialCooldown = 300;
                break;

            case 'slow_only':
                const saoSlowDuration = this.upgrades.includes('slow') ? 150 : 90;
                for (let enemy of gameState.enemies) {
                    if (!enemy.alive || enemy.converted) continue;
                    const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
                    if (distance < this.stats.range) {
                        enemy.applySlow(saoSlowDuration);
                    }
                }
                this.specialCooldown = 120;
                break;

            case 'conspiracy_only':
                if (this.upgrades.includes('convert')) {
                    for (let enemy of gameState.enemies) {
                        if (!enemy.alive || enemy.converted) continue;
                        const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
                        if (distance < this.stats.range && Math.random() < 0.3) {
                            enemy.convert();
                            addSpeechBubble(enemy.x, enemy.y - 30, "Pō converted them!");
                        }
                    }
                    this.specialCooldown = 600;
                } else {
                    const slowDuration = this.upgrades.includes('conspiracy') ? 120 : 80;
                    for (let enemy of gameState.enemies) {
                        if (!enemy.alive || enemy.converted) continue;
                        const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
                        if (distance < this.stats.range) {
                            enemy.applySlow(slowDuration);
                        }
                    }
                    this.specialCooldown = 180;
                }
                break;

            case 'cuteness_wide':
                if (this.upgrades.includes('cute')) {
                    for (let enemy of gameState.enemies) {
                        if (!enemy.alive || enemy.converted) continue;
                        const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
                        if (distance < this.stats.range) {
                            enemy.stun(30);
                        }
                    }
                    this.specialCooldown = 600;
                }
                break;

            case 'singing_stun':
                const singRange = this.upgrades.includes('harmony') ? this.stats.range + 50 : this.stats.range;
                const stunDuration = this.upgrades.includes('harmony') ? 120 : 80;
                let stunCount = 0;

                for (let enemy of gameState.enemies) {
                    if (!enemy.alive || enemy.converted) continue;
                    const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
                    if (distance < singRange) {
                        enemy.stun(stunDuration);
                        stunCount++;
                    }
                }

                if (stunCount > 0) {
                    addSpeechBubble(this.x, this.y - 30, `♪ Aviva's song stunned ${stunCount} enemies! ♪`);
                }

                const cooldown = this.upgrades.includes('repertoire') ? 400 : 600;
                this.specialCooldown = cooldown;
                break;

            case 'grapple_close':
                if (!this.grappledEnemies) return;
                const grappleRange = 60;
                const maxGrapples = this.upgrades.includes('strength') ? 3 : 1;
                const grappleDuration = this.upgrades.includes('grapple') ? 300 : 180;

                let grappled = 0;
                for (let enemy of gameState.enemies) {
                    if (!enemy.alive || enemy.converted || enemy.grappled) continue;
                    if (grappled >= maxGrapples) break;

                    const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
                    if (distance < grappleRange) {
                        enemy.grappled = true;
                        enemy.grappleStun = grappleDuration;
                        this.grappledEnemies.push({
                            enemy: enemy,
                            duration: grappleDuration
                        });
                        grappled++;
                        addSpeechBubble(enemy.x, enemy.y - 30, "Grappled! 🤼");
                    }
                }

                if (this.upgrades.includes('listening') && this.grappledEnemies.length > 0) {
                    for (let friend of gameState.friends) {
                        const distance = Math.sqrt((friend.x - this.x) ** 2 + (friend.y - this.y) ** 2);
                        if (distance < 120 && friend !== this) {
                            friend.lastShot = Math.max(0, friend.lastShot - 100);
                        }
                    }
                }

                this.specialCooldown = 240;
                break;
        }
    }

    canUpgrade() {
        return this.upgrades.length < 2;
    }

    upgrade(upgradeType: string) {
        if (!this.canUpgrade() || this.upgrades.includes(upgradeType)) return false;

        this.upgrades.push(upgradeType);

        switch (upgradeType) {
            case 'damage':
                this.stats.damage = Math.floor(this.stats.damage * 1.5);
                break;
            case 'rate':
                this.stats.fireRate = Math.floor(this.stats.fireRate * 0.6);
                break;
            case 'range':
                this.stats.range = Math.floor(this.stats.range * 1.3);
                break;
            case 'speed':
                this.stats.fireRate = Math.floor(this.stats.fireRate * 0.33);
                break;
            case 'study':
                if (this.type === 'maddie') {
                    this.experienceGainRate = 2;
                }
                break;
            case 'experience':
                if (this.type === 'maddie' && this.experienceLevel !== undefined && this.maxExperience !== undefined) {
                    this.experienceLevel = Math.min(this.maxExperience, this.experienceLevel + 5);
                }
                break;
            case 'wisdom':
                if (this.type === 'maddie' && this.maxExperience !== undefined) {
                    this.maxExperience = 15;
                }
                break;
            case 'volume':
                if (this.type === 'aviva') {
                    this.stats.range = Math.floor(this.stats.range * 1.4);
                    this.stats.damage = Math.floor(this.stats.damage * 1.3);
                }
                break;
        }

        return true;
    }

    draw() {
        ctx.fillStyle = this.stats.color;
        ctx.fillRect(this.x - 15, this.y - 15, 30, 30);

        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - 15, this.y - 15, 30, 30);

        if (this.type === 'dario' && !gameState.darioPhotoUsed) {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(this.x - 20, this.y - 20, 10, 10);
            ctx.fillStyle = 'black';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('📷', this.x - 15, this.y - 13);
        }

        if (this.type === 'tony' && !gameState.tonyMoveUsed) {
            ctx.fillStyle = 'cyan';
            ctx.fillRect(this.x + 10, this.y - 20, 10, 10);
            ctx.fillStyle = 'black';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('➤', this.x + 15, this.y - 13);
        }

        if (this.type === 'ruel' && !gameState.trainRampageUsed) {
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(this.x - 20, this.y + 10, 10, 10);
            ctx.fillStyle = 'white';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🚂', this.x - 15, this.y + 17);
        }

        if (this.type === 'maddie' && this.experienceLevel !== undefined && this.maxExperience !== undefined) {
            ctx.fillStyle = '#3F51B5';
            ctx.fillRect(this.x - 20, this.y + 15, 40, 6);
            ctx.fillStyle = '#00ff41';
            const expWidth = (this.experienceLevel / this.maxExperience) * 40;
            ctx.fillRect(this.x - 20, this.y + 15, expWidth, 6);

            ctx.fillStyle = 'white';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`LV${this.experienceLevel}`, this.x, this.y + 26);
        }

        if (this.type === 'aviva' && this.specialCooldown > 0) {
            ctx.fillStyle = '#FF6B9D';
            ctx.fillText('♪', this.x - 20, this.y - 20);
        }

        if (this.type === 'oise' && this.grappledEnemies && this.grappledEnemies.length > 0) {
            ctx.fillStyle = '#795548';
            ctx.fillText(`🤼${this.grappledEnemies.length}`, this.x + 15, this.y - 20);
        }

        if (this.upgrades.length > 0) {
            ctx.fillStyle = 'gold';
            for (let i = 0; i < this.upgrades.length; i++) {
                ctx.fillRect(this.x - 18 + i * 8, this.y - 18, 6, 6);
            }
        }

        ctx.fillStyle = 'white';
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.type.toUpperCase(), this.x, this.y + 2);

        if (gameState.selectedFriend === this.type) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.stats.range, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}
