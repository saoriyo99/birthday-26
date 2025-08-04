// Type definitions
export interface Point {
    x: number;
    y: number;
}

export interface PathPoint extends Point {
    pathIndex: number;
}

export interface MapData {
    name: string;
    desc: string;
    difficulty: string;
    theme: string;
    paths: Point[][];
    spawns: PathPoint[];
}

export interface FriendStats {
    cost: number;
    damage: number;
    range: number;
    fireRate: number;
    color: string;
    special: string;
    strong: string[];
    weak: string[];
    upgrades: string[];
    desc: string;
    category: string;
    experienceLevel?: number;
    maxExperience?: number;
}

export interface EnemyStats {
    health: number;
    speed: number;
    reward: number;
    socialDamage: number;
    color: string;
    name: string;
    icon: string;
    desc: string;
    category: string;
}

export interface WaveConfig {
    enemies: string[];
    count: number;
    name: string;
    desc: string;
}

export interface UpgradeOption {
    name: string;
    cost: number;
    desc: string;
    icon: string;
}

export interface GameState {
    health: number;
    money: number;
    wave: number;
    score: number;
    selectedFriend: string | null;
    enemies: any[]; // Use 'any' for now, will be replaced with Enemy class
    friends: any[]; // Use 'any' for now, will be replaced with Friend class
    projectiles: any[]; // Use 'any' for now, will be replaced with Projectile class
    speechBubbles: any[]; // Use 'any' for now, will be replaced with SpeechBubble class
    trains: any[]; // Use 'any' for now, will be replaced with Train class
    waveActive: boolean;
    enemiesRemaining: number;
    codingProgress: number;
    bananas: any[]; // Use 'any' for now, will be replaced with Banana class
    selectedFriendForUpgrade: any | null; // Use 'any' for now, will be replaced with Friend class
    enemiesSpawned: number;
    gameOver: boolean;
    gameStarted: boolean;
    mapSelected: boolean;
    currentMap: number | null;
    totalEnemiesDefeated: number;
    gameSpeed: number;
    darioPhotoUsed: boolean;
    tonyMoveUsed: boolean;
    trainRampageUsed: boolean;
    movingTony: any | null; // Use 'any' for now, will be replaced with Friend class
    unlockedMaps: number[];
    mouseX?: number;
    mouseY?: number;
}
