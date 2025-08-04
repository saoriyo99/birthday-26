import './style.css';
import {
    gameState,
    setGameState,
    canvas,
    ctx,
    friendTypes,
    maps,
    updateUI,
    drawPath,
    selectFriend,
    startNextWave,
    toggleSpeed,
    showCodex,
    closeCodex,
    startWaveFromModal,
    closeUpgradeModal,
    applyUpgrade,
    startGame,
    showMapSelection,
    selectMap,
    startNewGame,
    showStorylineOnly,
    deleteSaveSlot,
    confirmDelete,
    cancelDelete,
    showExitConfirm,
    confirmExit,
    cancelExit,
    backToSaveSlots,
    startNewGameInSlot,
    loadSlotAndSelectMap,
    placeFriend,
    cancelSelection,
    showUpgradeModal,
    familyPhoto,
    trainRampage,
    addSpeechBubble,
    showNotification,
} from './game';

function gameLoop() {
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'start';
    ctx.font = '12px Courier New';
    ctx.fillStyle = '#00ff41';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    drawPath();

    if (gameState.gameStarted) {
        gameState.friends.forEach(friend => {
            friend.update();
            friend.draw();
        });

        let enemies = gameState.enemies.filter(enemy => {
            enemy.update();
            enemy.draw();
            return enemy.alive;
        });
        setGameState({ enemies: enemies });


        let projectiles = gameState.projectiles.filter(projectile => {
            projectile.update();
            projectile.draw();
            return projectile.alive;
        });
        setGameState({ projectiles: projectiles });

        let bananas = gameState.bananas.filter(banana => {
            banana.update();
            banana.draw();
            return banana.life > 0;
        });
        setGameState({ bananas: bananas });

        let trains = gameState.trains.filter(train => {
            train.update();
            train.draw();
            return train.isAlive();
        });
        setGameState({ trains: trains });

        let speechBubbles = gameState.speechBubbles.filter(bubble => {
            bubble.update();
            bubble.draw();
            return bubble.life > 0;
        });
        setGameState({ speechBubbles: speechBubbles });
    }

    if (gameState.selectedFriend && !gameState.gameOver && gameState.mouseX !== undefined && gameState.mouseY !== undefined) {
        const mouseX = gameState.mouseX;
        const mouseY = gameState.mouseY;

        const isValid = !isPath(mouseX, mouseY) && !isFriend(mouseX, mouseY);

        ctx.fillStyle = isValid ? 'rgba(0, 255, 65, 0.8)' : 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(mouseX - 15, mouseY - 15, 30, 30);

        ctx.strokeStyle = isValid ? '#00ff41' : '#ff4757';
        ctx.lineWidth = 3;
        ctx.strokeRect(mouseX - 15, mouseY - 15, 30, 30);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(gameState.selectedFriend.toUpperCase(), mouseX, mouseY + 3);

        ctx.strokeStyle = isValid ? 'rgba(0, 255, 65, 0.6)' : 'rgba(255, 0, 0, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, friendTypes[gameState.selectedFriend].range, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    updateUI();

    requestAnimationFrame(gameLoop);
}

function isPath(x: number, y: number) {
    if (!gameState.mapSelected || gameState.currentMap === null) return false;
    const currentMap = maps[gameState.currentMap];
    for (const path of currentMap.paths) {
        for (let i = 0; i < path.length - 1; i++) {
            const p1 = path[i];
            const p2 = path[i + 1];
            const distance = distanceToLineSegment(x, y, p1.x, p1.y, p2.x, p2.y);
            if (distance < 40) return true;
        }
    }
    return false;
}

function isFriend(x: number, y: number) {
    return gameState.friends.some(friend =>
        Math.sqrt((friend.x - x) ** 2 + (friend.y - y) ** 2) < 35
    );
}

function distanceToLineSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = dx * dx + dy * dy;
    if (length === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    let t = ((px - x1) * dx + (py - y1) * dy) / length;
    t = Math.max(0, Math.min(1, t));
    const projectionX = x1 + t * dx;
    const projectionY = y1 + t * dy;
    return Math.sqrt((px - projectionX) ** 2 + (py - projectionY) ** 2);
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log(`Canvas clicked at ${x}, ${y}`);

    if (!gameState.gameOver && gameState.gameStarted) {
        let specialUsed = false;

        for (let friend of gameState.friends) {
            if (friend.type === 'dario' && !gameState.darioPhotoUsed) {
                const distance = Math.sqrt((friend.x - x) ** 2 + (friend.y - y) ** 2);
                if (distance < 25) {
                    setGameState({ darioPhotoUsed: true });
                    familyPhoto();
                    specialUsed = true;
                    break;
                }
            }
        }

        if (!specialUsed) {
            for (let friend of gameState.friends) {
                if (friend.type === 'ruel' && !gameState.trainRampageUsed) {
                    const distance = Math.sqrt((friend.x - x) ** 2 + (friend.y - y) ** 2);
                    if (distance < 25) {
                        setGameState({ trainRampageUsed: true });
                        trainRampage(friend);
                        specialUsed = true;
                        break;
                    }
                }
            }
        }

        if (!specialUsed) {
            for (let friend of gameState.friends) {
                if (friend.type === 'tony' && !gameState.tonyMoveUsed) {
                    const distance = Math.sqrt((friend.x - x) ** 2 + (friend.y - y) ** 2);
                    if (distance < 25) {
                        setGameState({ movingTony: friend });
                        addSpeechBubble(friend.x, friend.y - 30, "Hey I'm coming to visit!");
                        showNotification("Click where Tony should move to!");
                        specialUsed = true;
                        break;
                    }
                }
            }
        }

        if (!specialUsed && gameState.movingTony) {
            if (!isPath(x, y) && !isFriend(x, y)) {
                gameState.movingTony.x = x;
                gameState.movingTony.y = y;
                setGameState({ tonyMoveUsed: true });
                addSpeechBubble(x, y - 30, "Tony relocated!");
                setGameState({ movingTony: null });
                specialUsed = true;
            } else {
                showNotification("Can't move Tony there!");
            }
        }

        if (!specialUsed && !gameState.movingTony) {
            placeFriend(x, y);
        }
    }
});

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (!gameState.gameOver) {
        if (gameState.selectedFriend) {
            cancelSelection();
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let friend of gameState.friends) {
            const distance = Math.sqrt((friend.x - x) ** 2 + (friend.y - y) ** 2);
            if (distance < 25) {
                showUpgradeModal(friend);
                break;
            }
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    setGameState({
        mouseX: e.clientX - rect.left,
        mouseY: e.clientY - rect.top,
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (gameState.selectedFriend) {
            cancelSelection();
        }
        const upgradeModal = document.getElementById('upgradeModal');
        if (upgradeModal && (upgradeModal as HTMLElement).style.display === 'flex') {
            closeUpgradeModal();
        }
        const codexModal = document.getElementById('codexModal');
        if (codexModal && (codexModal as HTMLElement).style.display === 'flex') {
            closeCodex();
        }
    }
});

declare global {
    interface Window {
        selectFriend: (type: string) => void;
        startNextWave: () => void;
        toggleSpeed: () => void;
        showCodex: () => void;
        closeCodex: () => void;
        startWaveFromModal: () => void;
        closeUpgradeModal: () => void;
        applyUpgrade: (upgradeType: string) => void;
        startGame: () => void;
        showMapSelection: () => void;
        selectMap: (mapIndex: number) => void;
        startNewGame: () => void;
        showStorylineOnly: () => void;
        deleteSaveSlot: (slotName: string, event: MouseEvent) => void;
        confirmDelete: () => void;
        cancelDelete: () => void;
        showExitConfirm: () => void;
        confirmExit: () => void;
        cancelExit: () => void;
        backToSaveSlots: () => void;
        startNewGameInSlot: (slotName: string) => void;
        loadSlotAndSelectMap: (slotName: string, saveData: any) => void;
    }
}

window.selectFriend = selectFriend;
window.startNextWave = startNextWave;
window.toggleSpeed = toggleSpeed;
window.showCodex = showCodex;
window.closeCodex = closeCodex;
window.startWaveFromModal = startWaveFromModal;
window.closeUpgradeModal = closeUpgradeModal;
window.applyUpgrade = applyUpgrade;
window.startGame = startGame;
window.showMapSelection = showMapSelection;
window.selectMap = selectMap;
window.startNewGame = startNewGame;
window.showStorylineOnly = showStorylineOnly;
window.deleteSaveSlot = deleteSaveSlot;
window.confirmDelete = confirmDelete;
window.cancelDelete = cancelDelete;
window.showExitConfirm = showExitConfirm;
window.confirmExit = confirmExit;
window.cancelExit = cancelExit;
window.backToSaveSlots = backToSaveSlots;
window.startNewGameInSlot = startNewGameInSlot;
window.loadSlotAndSelectMap = loadSlotAndSelectMap;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');

    if (ctx) {
        console.log('Canvas context initialized successfully');
        ctx.fillStyle = '#00ff41';
        ctx.fillRect(0, 0, 50, 50);
        console.log('Drew test rectangle');
    } else {
        console.error('Failed to get canvas context');
    }

    showStorylineOnly();
    updateUI();
    gameLoop();
});
