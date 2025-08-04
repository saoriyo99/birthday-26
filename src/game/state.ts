import { GameState } from './types';

// Initialize canvas and context first
export const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// Game state
export let gameState: GameState = {
    health: 20,
    money: 100,
    wave: 1,
    score: 0,
    selectedFriend: null,
    enemies: [],
    friends: [],
    projectiles: [],
    speechBubbles: [],
    trains: [],
    waveActive: false,
    enemiesRemaining: 0,
    codingProgress: 0,
    bananas: [],
    selectedFriendForUpgrade: null,
    enemiesSpawned: 0,
    gameOver: false,
    gameStarted: false,
    mapSelected: false,
    currentMap: null,
    totalEnemiesDefeated: 0,
    gameSpeed: 1,
    darioPhotoUsed: false,
    tonyMoveUsed: false,
    trainRampageUsed: false,
    movingTony: null,
    unlockedMaps: [0]
};

export function resetGameState() {
    gameState.health = 20;
    gameState.money = 100;
    gameState.wave = 1;
    gameState.score = 0;
    gameState.selectedFriend = null;
    gameState.enemies = [];
    gameState.friends = [];
    gameState.projectiles = [];
    gameState.speechBubbles = [];
    gameState.trains = [];
    gameState.waveActive = false;
    gameState.enemiesRemaining = 0;
    gameState.codingProgress = 0;
    gameState.bananas = [];
    gameState.selectedFriendForUpgrade = null;
    gameState.enemiesSpawned = 0;
    gameState.gameOver = false;
    gameState.gameStarted = false;
    gameState.mapSelected = false;
    gameState.currentMap = null;
    gameState.totalEnemiesDefeated = 0;
    gameState.gameSpeed = 1;
    gameState.darioPhotoUsed = false;
    gameState.tonyMoveUsed = false;
    gameState.trainRampageUsed = false;
    gameState.movingTony = null;
    gameState.unlockedMaps = [0];
}

export function setGameState(newState: Partial<GameState>) {
    gameState = { ...gameState, ...newState };
}
