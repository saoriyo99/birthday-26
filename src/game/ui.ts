import { gameState, setGameState, canvas, ctx, friendTypes, waveConfigs, upgradeOptions, maps, Friend, Enemy, distanceToLineSegment, trainRampage, familyPhoto, resetGameState, enemyTypes } from './';

let currentSlotToDelete: string | null = null;
let currentSaveSlot: string | null = null;

export function showNotification(message: string) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        (notification as HTMLElement).style.display = 'block';
        setTimeout(() => {
            (notification as HTMLElement).style.display = 'none';
        }, 3000);
    }
}

export function showGameOver() {
    setGameState({ gameOver: true });
    console.log('Game Over triggered');

    const finalWave = document.getElementById('finalWave');
    if (finalWave) finalWave.textContent = String(gameState.wave);

    const finalScore = document.getElementById('finalScore');
    if (finalScore) finalScore.textContent = String(gameState.score);

    const totalEnemies = document.getElementById('totalEnemies');
    if (totalEnemies) totalEnemies.textContent = String(gameState.totalEnemiesDefeated);

    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) (gameOverModal as HTMLElement).style.display = 'flex';
}

export function updateUI() {
    const healthEl = document.getElementById('health');
    if (healthEl) {
        healthEl.textContent = String(Math.max(0, gameState.health));
        if (gameState.health <= 5) {
            healthEl.classList.add('critical');
        } else {
            healthEl.classList.remove('critical');
        }
    }

    const moneyEl = document.getElementById('money');
    if (moneyEl) moneyEl.textContent = String(gameState.money);

    const waveEl = document.getElementById('wave');
    if (waveEl) waveEl.textContent = String(gameState.wave);

    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.textContent = String(gameState.score);

    Object.keys(friendTypes).forEach(type => {
        const btn = document.getElementById(type + 'Btn') as HTMLButtonElement;
        if (btn) {
            btn.disabled = gameState.money < friendTypes[type].cost || gameState.gameOver || !gameState.gameStarted || !gameState.mapSelected;
        }
    });

    const nextWaveBtn = document.getElementById('nextWaveBtn') as HTMLButtonElement;
    if (nextWaveBtn) {
        nextWaveBtn.disabled = gameState.gameOver || !gameState.gameStarted || !gameState.mapSelected;
    }

    updateUpgradeIndicators();

    const statusEl = document.getElementById('waveStatus');
    if (statusEl) {
        if (!gameState.mapSelected) {
            statusEl.textContent = 'Select a map to begin your coding journey!';
            statusEl.style.color = '#FFD700';
        } else if (gameState.gameOver) {
            statusEl.textContent = 'Game Over - Ben\'s social battery is depleted!';
            statusEl.style.color = '#ff4757';
        } else if (gameState.waveActive) {
            const remaining = gameState.enemies.filter(e => e.alive && !e.converted).length;
            const waveIndex = Math.min(gameState.wave - 1, waveConfigs.length - 1);
            const waveConfig = waveConfigs[waveIndex];
            statusEl.textContent = `${waveConfig.name} - ${remaining} social interactions remaining`;

            if (remaining === 0 && gameState.enemiesSpawned >= gameState.enemiesRemaining && !gameState.gameOver) {
                setTimeout(() => {
                    setGameState({ wave: gameState.wave + 1 });
                    autoSave();

                    if (gameState.wave > 12 && gameState.currentMap !== null) {
                        const nextMapIndex = gameState.currentMap + 1;
                        if (nextMapIndex < maps.length && !gameState.unlockedMaps.includes(nextMapIndex)) {
                            const newUnlockedMaps = [...gameState.unlockedMaps, nextMapIndex];
                            setGameState({ unlockedMaps: newUnlockedMaps });
                            showNotification(`New map unlocked: ${maps[nextMapIndex].name}!`);
                        }
                    }

                    resetWaveAbilities();

                    let waveReward = 25 + gameState.wave * 3;
                    setGameState({ money: gameState.money + waveReward });

                    updateCodingProgress();
                    statusEl.textContent = `${waveConfig.name} survived! +${waveReward} Focus Points`;
                    updateUI();
                }, 1000);
                setGameState({ waveActive: false });
            }
        } else {
            const nextWaveIndex = Math.min(gameState.wave - 1, waveConfigs.length - 1);
            const nextWaveConfig = waveConfigs[nextWaveIndex];
            statusEl.textContent = `Next: ${nextWaveConfig.name}`;
            statusEl.style.color = '#00ff41';
        }
    }

    updateCodingProgress();
}

export function updateCodingProgress() {
    let codingProgress = 0;
    let progressTextContent = '';

    if (gameState.wave <= 5) {
        codingProgress = (gameState.wave - 1) * 20;
        progressTextContent = 'Setting up development environment...';
    } else if (gameState.wave <= 10) {
        codingProgress = 20 + (gameState.wave - 5) * 16;
        progressTextContent = 'Writing core functions...';
    } else {
        codingProgress = 100;
        progressTextContent = 'Deployed to production!';
    }
    setGameState({ codingProgress });

    const progressText = document.getElementById('progressText');
    if (progressText) progressText.textContent = progressTextContent;


    const progressFill = document.getElementById('progressFill');
    if (progressFill) (progressFill as HTMLElement).style.width = gameState.codingProgress + '%';
}

export function showUpgradeModal(friend: Friend) {
    setGameState({ selectedFriendForUpgrade: friend });

    const upgradeTitle = document.getElementById('upgradeTitle');
    if (upgradeTitle) upgradeTitle.textContent = `Upgrade ${friend.type.toUpperCase()}`;

    let upgradeStatus = `Current upgrades (${friend.upgrades.length}/2 used): `;
    if (friend.upgrades.length === 0) {
        upgradeStatus += 'None';
    } else {
        upgradeStatus += friend.upgrades.map(up => upgradeOptions[up].name).join(', ');
    }

    const upgradeDescription = document.getElementById('upgradeDescription');
    if (upgradeDescription) upgradeDescription.textContent = upgradeStatus;

    const optionsContainer = document.getElementById('upgradeOptions');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';

        const availableUpgrades = friendTypes[friend.type].upgrades;

        for (let upgradeType of availableUpgrades) {
            const upgrade = upgradeOptions[upgradeType];
            const button = document.createElement('button');

            const isSelected = friend.upgrades.includes(upgradeType);
            const canAfford = gameState.money >= upgrade.cost;
            const canUpgrade = friend.canUpgrade();

            if (isSelected) {
                button.className = 'upgrade-btn selected';
                button.innerHTML = `${upgrade.icon}<br>${upgrade.name}<br>✅ EQUIPPED<br><small>${upgrade.desc}</small>`;
                button.disabled = true;
            } else if (!canAfford || !canUpgrade) {
                button.className = 'upgrade-btn unavailable';
                button.innerHTML = `${upgrade.icon}<br>${upgrade.name}<br>(${upgrade.cost}🍃)<br><small>${upgrade.desc}</small>`;
                button.disabled = true;
            } else {
                button.className = 'upgrade-btn';
                button.innerHTML = `${upgrade.icon}<br>${upgrade.name}<br>(${upgrade.cost}🍃)<br><small>${upgrade.desc}</small>`;
                button.onclick = () => applyUpgrade(upgradeType);
            }

            optionsContainer.appendChild(button);
        }
    }

    const upgradeModal = document.getElementById('upgradeModal');
    if (upgradeModal) (upgradeModal as HTMLElement).style.display = 'flex';
}

export function applyUpgrade(upgradeType: string) {
    const friend = gameState.selectedFriendForUpgrade;
    if (!friend) return;
    const upgrade = upgradeOptions[upgradeType];

    if (gameState.money >= upgrade.cost && friend.upgrade(upgradeType)) {
        setGameState({ money: gameState.money - upgrade.cost });
        updateUpgradeIndicators();
        updateUI();
        closeUpgradeModal();
        showNotification(`${friend.type.toUpperCase()} upgraded with ${upgrade.name}!`);
    }
}

export function closeUpgradeModal() {
    const upgradeModal = document.getElementById('upgradeModal');
    if (upgradeModal) (upgradeModal as HTMLElement).style.display = 'none';
    setGameState({ selectedFriendForUpgrade: null });
}

export function showCodex() {
    const friendsCodex = document.getElementById('friendsCodex');
    if (friendsCodex) {
        friendsCodex.innerHTML = '';

        for (let [type, data] of Object.entries(friendTypes)) {
            const div = document.createElement('div');
            div.className = 'codex-item';

            let strongIndicators = '';
            let weakIndicators = '';

            if (data.strong.length > 0) {
                strongIndicators = data.strong.map(enemy => `<span style="color: #4CAF50;">${enemyTypes[enemy].icon}</span>`).join(' ');
            }
            if (data.weak.length > 0) {
                weakIndicators = data.weak.map(enemy => `<span style="color: #F44336;">${enemyTypes[enemy].icon}</span>`).join(' ');
            }

            div.innerHTML = `
                <div class="codex-icon" style="background-color: ${data.color};">${type.charAt(0).toUpperCase()}</div>
                <div>
                    <strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong> (${data.cost}🍃)<br>
                    <small>${data.desc}</small><br>
                    <small><strong>Strong vs:</strong> ${strongIndicators || 'None'}</small><br>
                    <small><strong>Weak vs:</strong> ${weakIndicators || 'None'}</small>
                </div>
            `;
            friendsCodex.appendChild(div);
        }
    }

    const enemiesCodex = document.getElementById('enemiesCodex');
    if (enemiesCodex) {
        enemiesCodex.innerHTML = '';

        for (let [type, data] of Object.entries(enemyTypes)) {
            const div = document.createElement('div');
            div.className = 'codex-item';

            let counters: string[] = [];
            let struggles: string[] = [];

            for (let [friendType, friendData] of Object.entries(friendTypes)) {
                if (friendData.strong.includes(type)) {
                    counters.push(`<span style="color: ${friendData.color};">${friendType.charAt(0).toUpperCase()}</span>`);
                }
                if (friendData.weak.includes(type)) {
                    struggles.push(`<span style="color: ${friendData.color};">${friendType.charAt(0).toUpperCase()}</span>`);
                }
            }

            div.innerHTML = `
                <div class="codex-icon" style="background-color: ${data.color};">${data.icon}</div>
                <div>
                    <strong>${data.name}</strong> (${data.socialDamage} social damage)<br>
                    <small>${data.desc}</small><br>
                    <small><strong>Reward:</strong> ${data.reward}🍃 | <strong>Health:</strong> ${data.health} | <strong>Speed:</strong> ${data.speed}x</small><br>
                    <small><strong>Countered by:</strong> ${counters.join(' ') || 'Anyone'}</small><br>
                    <small><strong>Resists:</strong> ${struggles.join(' ') || 'None'}</small>
                </div>
            `;
            enemiesCodex.appendChild(div);
        }
    }

    const codexModal = document.getElementById('codexModal');
    if (codexModal) (codexModal as HTMLElement).style.display = 'flex';
}

export function closeCodex() {
    const codexModal = document.getElementById('codexModal');
    if (codexModal) (codexModal as HTMLElement).style.display = 'none';
}

export function updateUpgradeIndicators() {
    for (let friend of gameState.friends) {
        const btn = document.getElementById(friend.type + 'Btn');
        if (btn) {
            const indicator = btn.querySelector('.upgrade-indicator') as HTMLElement;
            if (indicator) {
                if (friend.canUpgrade()) {
                    indicator.style.display = 'flex';
                } else {
                    indicator.style.display = 'none';
                }
            }
        }
    }
}

export function drawPath() {
    if (!gameState.mapSelected || gameState.currentMap === null) return;

    const currentMap = maps[gameState.currentMap];

    for (let pathIndex = 0; pathIndex < currentMap.paths.length; pathIndex++) {
        const path = currentMap.paths[pathIndex];

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 30;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();

        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    for (let spawn of currentMap.spawns) {
        ctx.fillStyle = '#FF4500';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SPAWN', spawn.x + 60, spawn.y + 5);
    }

    const benPosition = { x: 750, y: 250 };
    ctx.fillStyle = gameState.health <= 5 ? '#ff4757' : '#00ff41';
    ctx.fillRect(benPosition.x - 25, benPosition.y - 25, 50, 50);
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BEN', benPosition.x, benPosition.y - 5);
    ctx.fillText('🧑‍💻', benPosition.x, benPosition.y + 15);
}

export function startGame() {
    const storylineModal = document.getElementById('storylineModal');
    if (storylineModal) storylineModal.style.display = 'none';

    const gameContainer = document.querySelector('.game-container') as HTMLElement;
    if (gameContainer) {
        gameContainer.style.opacity = '1';
        gameContainer.style.pointerEvents = 'auto';
    }

    showStartGameOptions();
}

export function showMapSelection() {
    const mapModal = document.getElementById('mapSelectionModal');
    const mapGrid = document.getElementById('mapGrid');

    if (mapGrid) {
        mapGrid.innerHTML = '';

        maps.forEach((map, index) => {
            const isUnlocked = gameState.unlockedMaps.includes(index);
            const mapDiv = document.createElement('div');

            mapDiv.style.cssText = isUnlocked ? `
                background: rgba(0, 255, 65, 0.1);
                border: 2px solid #00ff41;
                border-radius: 10px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
            ` : `
                background: rgba(100, 100, 100, 0.1);
                border: 2px solid #666;
                border-radius: 10px;
                padding: 15px;
                cursor: not-allowed;
                transition: all 0.3s ease;
                text-align: left;
                opacity: 0.5;
            `;

            const lockIcon = isUnlocked ? '' : '🔒 ';
            const difficultyColor = isUnlocked ? '#00ff41' : '#666';

            mapDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h3 style="margin: 0; color: ${difficultyColor};">${lockIcon}${map.name}</h3>
                    <span style="font-size: 16px; color: ${difficultyColor};">${map.difficulty}</span>
                </div>
                <p style="margin: 5px 0; font-size: 14px; opacity: 0.9;">${map.desc}</p>
                <p style="margin: 5px 0; font-size: 12px; opacity: 0.7; font-style: italic;">${map.theme}</p>
                <p style="margin: 5px 0; font-size: 11px; opacity: 0.6;">
                    ${map.spawns.length} entrance${map.spawns.length > 1 ? 's' : ''} • ${map.paths.length} path${map.paths.length > 1 ? 's' : ''}
                </p>
                ${!isUnlocked ? '<p style="margin: 5px 0; font-size: 11px; color: #ff6b6b;">Complete previous maps to unlock</p>' : ''}
            `;

            if (isUnlocked) {
                mapDiv.addEventListener('mouseenter', () => {
                    mapDiv.style.background = 'rgba(0, 255, 65, 0.2)';
                    mapDiv.style.transform = 'translateY(-2px)';
                    mapDiv.style.boxShadow = '0 5px 15px rgba(0, 255, 65, 0.3)';
                });

                mapDiv.addEventListener('mouseleave', () => {
                    mapDiv.style.background = 'rgba(0, 255, 65, 0.1)';
                    mapDiv.style.transform = 'translateY(0)';
                    mapDiv.style.boxShadow = 'none';
                });

                mapDiv.addEventListener('click', () => selectMap(index));
            }

            mapGrid.appendChild(mapDiv);
        });
    }

    if (mapModal) (mapModal as HTMLElement).style.display = 'flex';
}

export function selectMap(mapIndex: number) {
    setGameState({
        currentMap: mapIndex,
        mapSelected: true,
        gameStarted: true,
    });

    const mapModal = document.getElementById('mapSelectionModal');
    if (mapModal) (mapModal as HTMLElement).style.display = 'none';

    const progressText = document.getElementById('progressText');
    if (progressText) progressText.textContent = maps[mapIndex].theme;

    updateUI();
    console.log(`Selected map: ${maps[mapIndex].name}`);
}

export function selectFriend(type: string) {
    if (gameState.money >= friendTypes[type].cost && !gameState.gameOver && gameState.gameStarted) {
        document.querySelectorAll('.friend-btn').forEach(btn => btn.classList.remove('selected'));

        setGameState({ selectedFriend: type });
        canvas.style.cursor = 'crosshair';
        const btn = document.getElementById(type + 'Btn');
        if (btn) btn.classList.add('selected');

        const cancelText = document.getElementById('cancelText');
        if (cancelText) (cancelText as HTMLElement).style.display = 'block';

        console.log(`Selected friend: ${type}`);
    }
}

export function cancelSelection() {
    setGameState({ selectedFriend: null });
    canvas.style.cursor = 'default';
    document.querySelectorAll('.friend-btn').forEach(btn => btn.classList.remove('selected'));

    const cancelText = document.getElementById('cancelText');
    if (cancelText) (cancelText as HTMLElement).style.display = 'none';
}

export function placeFriend(x: number, y: number) {
    if (!gameState.selectedFriend || gameState.gameOver) return;

    const friendType = friendTypes[gameState.selectedFriend];
    if (gameState.money < friendType.cost) return;

    if (isOnPath(x, y) || isOnFriend(x, y)) {
        showNotification('Cannot place here!');
        return;
    }

    console.log(`Placing ${gameState.selectedFriend} at ${x}, ${y}`);
    const newFriends = [...gameState.friends, new Friend(x, y, gameState.selectedFriend)];
    setGameState({
        friends: newFriends,
        money: gameState.money - friendType.cost,
    });
    cancelSelection();
    updateUI();
    console.log(`Total friends: ${gameState.friends.length}`);
}

export function isOnPath(x: number, y: number) {
    if (!gameState.mapSelected || gameState.currentMap === null) return false;

    const currentMap = maps[gameState.currentMap];
    for (let path of currentMap.paths) {
        for (let i = 0; i < path.length - 1; i++) {
            const p1 = path[i];
            const p2 = path[i + 1];
            const distance = distanceToLineSegment(x, y, p1.x, p1.y, p2.x, p2.y);
            if (distance < 40) return true;
        }
    }
    return false;
}

export function isOnFriend(x: number, y: number) {
    return gameState.friends.some(friend =>
        Math.sqrt((friend.x - x) ** 2 + (friend.y - y) ** 2) < 35
    );
}

export function toggleSpeed() {
    setGameState({ gameSpeed: gameState.gameSpeed === 1 ? 2 : 1 });
    const speedBtn = document.getElementById('speedBtn');

    if (speedBtn) {
        if (gameState.gameSpeed === 2) {
            speedBtn.textContent = '🚀 Fast';
            speedBtn.classList.add('fast');
        } else {
            speedBtn.textContent = '🐌 Normal';
            speedBtn.classList.remove('fast');
        }
    }
}

export function showWavePreview() {
    if (gameState.gameOver) return;

    const waveIndex = Math.min(gameState.wave - 1, waveConfigs.length - 1);
    const waveConfig = waveConfigs[waveIndex];

    const waveTitle = document.getElementById('waveTitle');
    if (waveTitle) waveTitle.textContent = `Wave ${gameState.wave}: ${waveConfig.name}`;

    const waveDescription = document.getElementById('waveDescription');
    if (waveDescription) waveDescription.textContent = waveConfig.desc;

    const enemyPreview = document.getElementById('enemyPreview');
    if (enemyPreview) {
        enemyPreview.innerHTML = '';

        const enemyCounts: { [key: string]: number } = {};
        for (let enemyType of waveConfig.enemies) {
            enemyCounts[enemyType] = (enemyCounts[enemyType] || 0) + 1;
        }

        for (let [enemyType, count] of Object.entries(enemyCounts)) {
            const enemy = enemyTypes[enemyType];
            const div = document.createElement('div');
            div.className = 'enemy-icon';
            div.style.backgroundColor = enemy.color;
            div.textContent = enemy.icon;
            div.title = `${enemy.name} x${count}`;
            enemyPreview.appendChild(div);
        }
    }

    const waveModal = document.getElementById('waveModal');
    if (waveModal) (waveModal as HTMLElement).style.display = 'flex';
}

export function startNextWave() {
    if (gameState.waveActive || gameState.gameOver || !gameState.gameStarted || !gameState.mapSelected) return;
    showWavePreview();
}

export function startWaveFromModal() {
    const waveModal = document.getElementById('waveModal');
    if (waveModal) (waveModal as HTMLElement).style.display = 'none';

    setGameState({ waveActive: true, enemiesSpawned: 0 });

    const waveIndex = Math.min(gameState.wave - 1, waveConfigs.length - 1);
    const waveConfig = waveConfigs[waveIndex];

    const baseCount = waveConfig.count;
    const scaledCount = Math.floor(baseCount * Math.pow(1.1, gameState.wave - 1));
    setGameState({ enemiesRemaining: scaledCount });

    const baseSpawnDelay = Math.max(800, 1800 - gameState.wave * 50);
    const spawnDelay = baseSpawnDelay / gameState.gameSpeed;

    const spawnInterval = setInterval(() => {
        if (gameState.enemiesSpawned >= gameState.enemiesRemaining || gameState.gameOver) {
            clearInterval(spawnInterval);
            return;
        }

        const enemyType = waveConfig.enemies[gameState.enemiesSpawned % waveConfig.enemies.length];
        const newEnemies = [...gameState.enemies, new Enemy(enemyType)];
        setGameState({
            enemies: newEnemies,
            enemiesSpawned: gameState.enemiesSpawned + 1,
        });
    }, spawnDelay);

    updateUI();
}

export function resetWaveAbilities() {
    setGameState({
        darioPhotoUsed: false,
        tonyMoveUsed: false,
        movingTony: null,
        trainRampageUsed: false,
    });
    console.log('Wave abilities reset!');
};

export function autoSave() {
    if (currentSaveSlot && gameState.gameStarted && !gameState.gameOver) {
        autoSaveToSlot();
    }
}

export function saveGame(slotName = 'quicksave') {
    const saveData = {
        health: gameState.health,
        money: gameState.money,
        wave: gameState.wave,
        score: gameState.score,
        currentMap: gameState.currentMap,
        totalEnemiesDefeated: gameState.totalEnemiesDefeated,
        codingProgress: gameState.codingProgress,
        unlockedMaps: gameState.unlockedMaps,
        friends: gameState.friends.map(friend => ({
            x: friend.x,
            y: friend.y,
            type: friend.type,
            upgrades: friend.upgrades,
            experienceLevel: friend.experienceLevel || 0
        })),
        darioPhotoUsed: gameState.darioPhotoUsed,
        tonyMoveUsed: gameState.tonyMoveUsed,
        trainRampageUsed: gameState.trainRampageUsed,
        gameStarted: gameState.gameStarted,
        mapSelected: gameState.mapSelected,
        waveActive: gameState.waveActive,
        savedAt: new Date().toISOString(),
        version: '1.0'
    };

    try {
        localStorage.setItem(`benDefense_${slotName}`, JSON.stringify(saveData));
        console.log('Game saved successfully:', slotName);
    } catch (error) {
        console.error('Save failed:', error);
    }
}

export function loadGame(slotName = 'quicksave') {
    try {
        const saveDataStr = localStorage.getItem(`benDefense_${slotName}`);
        if (!saveDataStr) {
            showNotification(`No save found: ${slotName}`);
            return false;
        }

        const saveData = JSON.parse(saveDataStr);

        setGameState({
            health: saveData.health,
            money: saveData.money,
            wave: saveData.wave,
            score: saveData.score,
            currentMap: saveData.currentMap,
            totalEnemiesDefeated: saveData.totalEnemiesDefeated || 0,
            codingProgress: saveData.codingProgress || 0,
            unlockedMaps: saveData.unlockedMaps || [0],
            gameStarted: saveData.gameStarted,
            mapSelected: saveData.mapSelected,
            waveActive: saveData.waveActive || false,
            darioPhotoUsed: saveData.darioPhotoUsed || false,
            tonyMoveUsed: saveData.tonyMoveUsed || false,
            trainRampageUsed: saveData.trainRampageUsed || false,
            friends: [],
            enemies: [],
            projectiles: [],
            trains: [],
            speechBubbles: [],
            bananas: [],
        });

        if (saveData.friends) {
            const newFriends = saveData.friends.map((friendData: any) => {
                const friend = new Friend(friendData.x, friendData.y, friendData.type);

                if (friendData.upgrades) {
                    friendData.upgrades.forEach((upgradeType: string) => {
                        friend.upgrade(upgradeType);
                    });
                }

                if (friendData.experienceLevel) {
                    friend.experienceLevel = friendData.experienceLevel;
                }

                return friend;
            });
            setGameState({ friends: newFriends });
        }

        updateUI();
        showNotification(`Game loaded from ${slotName}!`);
        console.log('Game loaded successfully:', slotName);
        return true;

    } catch (error) {
        showNotification('Failed to load game!');
        console.error('Load failed:', error);
        return false;
    }
}

export function getSaveData(slotName: string) {
    try {
        const saveDataStr = localStorage.getItem(`benDefense_${slotName}`);
        return saveDataStr ? JSON.parse(saveDataStr) : null;
    } catch (error) {
        console.error('Failed to parse save data:', error);
        return null;
    }
}

export function startNewGameInSlot(slotName: string) {
    currentSaveSlot = slotName;

    const startModal = document.getElementById('startGameModal');
    if (startModal) (startModal as HTMLElement).style.display = 'none';

    resetGameState();
    showMapSelection();
}

export function loadSlotAndSelectMap(slotName: string, saveData: any) {
    currentSaveSlot = slotName;

    if (loadGame(slotName)) {
        const startModal = document.getElementById('startGameModal');
        if (startModal) (startModal as HTMLElement).style.display = 'none';
        showMapSelection();
    } else {
        showNotification('Failed to load save game!');
    }
}

export function startNewGame() {
    const startModal = document.getElementById('startGameModal');
    if (startModal) (startModal as HTMLElement).style.display = 'none';

    resetGameState();
    showMapSelection();
}

export function showStorylineOnly() {
    console.log('Showing storyline modal only');

    document.querySelectorAll('.modal, .storyline-modal').forEach(modal => {
        (modal as HTMLElement).style.display = 'none';
    });

    const storylineModal = document.getElementById('storylineModal');
    if (storylineModal) {
        (storylineModal as HTMLElement).style.display = 'flex';
        console.log('Storyline modal is now visible');
    }

    const gameContainer = document.querySelector('.game-container') as HTMLElement;
    if (gameContainer) {
        gameContainer.style.opacity = '0.3';
        gameContainer.style.pointerEvents = 'none';
    }

    setGameState({
        gameStarted: false,
        mapSelected: false,
        gameOver: false,
    });
}

export function deleteSaveSlot(slotName: string, event: MouseEvent) {
    event.stopPropagation();

    const saveData = getSaveData(slotName);
    if (!saveData) return;

    currentSlotToDelete = slotName;

    const deleteModal = document.getElementById('deleteConfirmModal');
    const deleteText = document.getElementById('deleteConfirmText');

    if (deleteModal && deleteText) {
        const mapName = maps[saveData.currentMap]?.name || 'Unknown Map';
        deleteText.innerHTML = `
            Are you sure you want to delete this save?<br><br>
            <strong>Wave ${saveData.wave}</strong> • ${mapName}<br>
            <small>This action cannot be undone.</small>
        `;
        (deleteModal as HTMLElement).style.display = 'flex';
    }
}

export function confirmDelete() {
    if (currentSlotToDelete) {
        localStorage.removeItem(`benDefense_${currentSlotToDelete}`);
        showNotification(`Save slot deleted!`);
        currentSlotToDelete = null;

        const deleteModal = document.getElementById('deleteConfirmModal');
        if (deleteModal) (deleteModal as HTMLElement).style.display = 'none';
        showStartGameOptions();
    }
}

export function cancelDelete() {
    currentSlotToDelete = null;
    const deleteModal = document.getElementById('deleteConfirmModal');
    if (deleteModal) (deleteModal as HTMLElement).style.display = 'none';
}

export function showExitConfirm() {
    const exitModal = document.getElementById('exitConfirmModal');
    if (exitModal) {
        (exitModal as HTMLElement).style.display = 'flex';
    }
}

export function confirmExit() {
    if (currentSaveSlot) {
        autoSaveToSlot();
    }

    closeAllModals();
    showMapSelection();
    showNotification('Progress saved!');
}

export function cancelExit() {
    const exitModal = document.getElementById('exitConfirmModal');
    if (exitModal) (exitModal as HTMLElement).style.display = 'none';
}

export function autoSaveToSlot() {
    if (currentSaveSlot) {
        const saveData = {
            health: gameState.health,
            money: gameState.money,
            wave: gameState.wave,
            score: gameState.score,
            currentMap: gameState.currentMap,
            totalEnemiesDefeated: gameState.totalEnemiesDefeated,
            codingProgress: gameState.codingProgress,
            unlockedMaps: gameState.unlockedMaps,
            friends: gameState.friends.map(friend => ({
                x: friend.x,
                y: friend.y,
                type: friend.type,
                upgrades: friend.upgrades,
                experienceLevel: friend.experienceLevel || 0
            })),
            darioPhotoUsed: gameState.darioPhotoUsed,
            tonyMoveUsed: gameState.tonyMoveUsed,
            trainRampageUsed: gameState.trainRampageUsed,
            gameStarted: gameState.gameStarted,
            mapSelected: gameState.mapSelected,
            waveActive: gameState.waveActive,
            savedAt: new Date().toISOString(),
            version: '1.0'
        };

        localStorage.setItem(`benDefense_${currentSaveSlot}`, JSON.stringify(saveData));
        console.log('Auto-saved to slot:', currentSaveSlot);
    } else {
        console.log('No currentSaveSlot set - cannot auto-save');
    }
}

export function backToSaveSlots() {
    const mapModal = document.getElementById('mapSelectionModal');
    if (mapModal) (mapModal as HTMLElement).style.display = 'none';

    currentSaveSlot = null;
    resetGameState();
    showStartGameOptions();
}

export function showStartGameOptions() {
    const startModal = document.getElementById('startGameModal');
    const slotGrid = document.getElementById('saveSlotGrid');

    if (startModal && slotGrid) {
        slotGrid.innerHTML = '';

        for (let i = 1; i <= 3; i++) {
            const slotName = `slot${i}`;
            const saveData = getSaveData(slotName);

            const slotDiv = document.createElement('div');
            slotDiv.style.cssText = `
                background: rgba(0, 255, 65, 0.1);
                border: 2px solid #00ff41;
                border-radius: 15px;
                padding: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                min-height: 120px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            `;

            if (saveData) {
                const saveTime = new Date(saveData.savedAt).toLocaleString();
                const mapName = maps[saveData.currentMap]?.name || 'Unknown Map';

                slotDiv.innerHTML = `
                    <div style="text-align: left;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px; color: #00ff41;">
                            Save Slot ${i}
                        </div>
                        <div style="font-size: 14px; margin-bottom: 4px;">
                            <strong>Wave ${saveData.wave}</strong> • ${saveData.score} commits
                        </div>
                        <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px;">
                            📍 ${mapName} • ❤️ ${saveData.health} • 💰 ${saveData.money}
                        </div>
                        <div style="font-size: 11px; opacity: 0.6;">
                            ${saveTime}
                        </div>
                    </div>
                    <button onclick="window.deleteSaveSlot('${slotName}', event)"
                            style="position: absolute; top: 10px; right: 10px; background: #ff4757; border: none;
                                   border-radius: 5px; color: white; padding: 5px 8px; cursor: pointer; font-size: 12px;">
                        🗑️
                    </button>
                `;

                slotDiv.addEventListener('click', () => loadSlotAndSelectMap(slotName, saveData));
            } else {
                slotDiv.innerHTML = `
                    <div style="text-align: center; opacity: 0.8;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #00ff41;">
                            Save Slot ${i}
                        </div>
                        <div style="font-size: 48px; margin-bottom: 10px;">➕</div>
                        <div style="font-size: 14px;">
                            Start New Game
                        </div>
                    </div>
                `;

                slotDiv.addEventListener('click', () => startNewGameInSlot(slotName));
            }

            slotDiv.addEventListener('mouseenter', () => {
                slotDiv.style.background = 'rgba(0, 255, 65, 0.2)';
                slotDiv.style.transform = 'translateY(-3px)';
                slotDiv.style.boxShadow = '0 8px 25px rgba(0, 255, 65, 0.3)';
            });

            slotDiv.addEventListener('mouseleave', () => {
                slotDiv.style.background = 'rgba(0, 255, 65, 0.1)';
                slotDiv.style.transform = 'translateY(0)';
                slotDiv.style.boxShadow = 'none';
            });

            slotGrid.appendChild(slotDiv);
        }

        (startModal as HTMLElement).style.display = 'flex';
    }
}

export function closeAllModals() {
    const modals = [
        'waveModal',
        'upgradeModal',
        'codexModal',
        'gameOverModal',
        'deleteConfirmModal',
        'exitConfirmModal'
    ];

    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            (modal as HTMLElement).style.display = 'none';
        }
    });
}
