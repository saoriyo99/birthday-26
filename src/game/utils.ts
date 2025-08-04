import { gameState, setGameState, SpeechBubble, Train, Friend, maps, showNotification } from './';

export function addSpeechBubble(x: number, y: number, message: string) {
    gameState.speechBubbles.push(new SpeechBubble(x, y, message));
}

export function familyPhoto() {
    for (let enemy of gameState.enemies) {
        if (enemy.alive && !enemy.converted) {
            enemy.stun(180);
        }
    }
    addSpeechBubble(400, 200, "Family photo time! Everyone smile! 📷");
    showNotification("Dario's family photo paused all enemies!");
}

export function trainRampage(ruelFriend: Friend) {
    if (gameState.currentMap === null) return;
    const currentMap = maps[gameState.currentMap];
    const spawnYOffsets = [-30, 30];

    const randomPath = currentMap.paths[Math.floor(Math.random() * currentMap.paths.length)];

    let best = { dist: Infinity, idx: 0 };
    for (let i = 0; i < randomPath.length - 1; i++) {
        const a = randomPath[i], b = randomPath[i + 1];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const d = Math.hypot(ruelFriend.x - mx, ruelFriend.y - my);
        if (d < best.dist) best = { dist: d, idx: i };
    }

    const isUpgraded = ruelFriend.upgrades.includes('trains');
    const trainCount = isUpgraded ? 2 : 1;
    const trainDamage = isUpgraded ? 120 : 80;

    for (let t = 0; t < trainCount; t++) {
        const train = new Train(ruelFriend.x, ruelFriend.y + (spawnYOffsets[t] || 0));
        train.path = randomPath;
        train.goingBackwards = true;
        train.nextWaypoint = Math.max(0, best.idx - 1);
        train.damage = trainDamage;
        gameState.trains.push(train);
    }

    const msg = isUpgraded
        ? "🚂🚂 DOUBLE TRAIN RAMPAGE! 🚂🚂"
        : "🚂 TRAIN RAMPAGE! All aboard! 🚂";
    addSpeechBubble(ruelFriend.x, ruelFriend.y - 30, msg);
    showNotification(isUpgraded ? "Double train power!" : "Ruel's train is coming through!");
}

export function distanceToLineSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (length * length)));
    const projection = { x: x1 + t * dx, y: y1 + t * dy };
    return Math.sqrt((px - projection.x) ** 2 + (py - projection.y) ** 2);
}
