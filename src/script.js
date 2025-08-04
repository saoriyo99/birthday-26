import './style.css';

// Initialize canvas and context first
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state - Fixed: Added all missing properties
let gameState = {
    health: 20,
    money: 100,
    wave: 1,
    score: 0,
    selectedFriend: null,
    enemies: [],
    friends: [],
    projectiles: [],
    speechBubbles: [], // Fixed: Added missing speechBubbles array
    trains: [], // New: Track Ruel's train rampages
    waveActive: false,
    enemiesRemaining: 0,
    codingProgress: 0,
    bananas: [],
    selectedFriendForUpgrade: null,
    enemiesSpawned: 0,
    gameOver: false,
    gameStarted: false, // Fixed: Added missing gameStarted flag
    mapSelected: false, // New: Track if map is selected
    currentMap: null, // New: Current map index
    totalEnemiesDefeated: 0,
    gameSpeed: 1, // 1 = normal, 2 = fast
    // New special abilities per wave (reset each wave)
    darioPhotoUsed: false,
    tonyMoveUsed: false,
    trainRampageUsed: false, // New: Ruel's train ability
    movingTony: null // Track which Tony is being moved
};

// Maps - Progressive difficulty with multiple paths
const maps = [
    {
        name: "Local Dev Environment",
        desc: "Simple setup - just you and your code",
        difficulty: "⭐",
        theme: "Setting up the basic development environment",
        paths: [
            [
                { x: 0, y: 300 },
                { x: 150, y: 300 },
                { x: 150, y: 150 },
                { x: 350, y: 150 },
                { x: 350, y: 450 },
                { x: 550, y: 450 },
                { x: 550, y: 250 },
                { x: 700, y: 250 },
                { x: 750, y: 250 }
            ]
        ],
        spawns: [{ x: 0, y: 300, pathIndex: 0 }]
    },
    {
        name: "Function Library",
        desc: "Building reusable functions - two ways in",
        difficulty: "⭐⭐",
        theme: "Writing modular, reusable code functions",
        paths: [
            [
                { x: 0, y: 200 },
                { x: 200, y: 200 },
                { x: 200, y: 300 },
                { x: 400, y: 300 },
                { x: 400, y: 400 },
                { x: 600, y: 400 },
                { x: 750, y: 250 }
            ],
            [
                { x: 0, y: 400 },
                { x: 150, y: 400 },
                { x: 150, y: 300 },
                { x: 400, y: 300 },
                { x: 400, y: 400 },
                { x: 600, y: 400 },
                { x: 750, y: 250 }
            ]
        ],
        spawns: [
            { x: 0, y: 200, pathIndex: 0 },
            { x: 0, y: 400, pathIndex: 1 }
        ]
    },
    {
        name: "API Integration",
        desc: "Connecting to external services - three endpoints",
        difficulty: "⭐⭐⭐",
        theme: "Integrating with third-party APIs and services",
        paths: [
            [
                { x: 0, y: 150 },
                { x: 250, y: 150 },
                { x: 250, y: 250 },
                { x: 500, y: 250 },
                { x: 750, y: 250 }
            ],
            [
                { x: 0, y: 300 },
                { x: 200, y: 300 },
                { x: 200, y: 250 },
                { x: 500, y: 250 },
                { x: 750, y: 250 }
            ],
            [
                { x: 0, y: 450 },
                { x: 300, y: 450 },
                { x: 300, y: 350 },
                { x: 500, y: 350 },
                { x: 500, y: 250 },
                { x: 750, y: 250 }
            ]
        ],
        spawns: [
            { x: 0, y: 150, pathIndex: 0 },
            { x: 0, y: 300, pathIndex: 1 },
            { x: 0, y: 450, pathIndex: 2 }
        ]
    },
    {
        name: "Testing Suite",
        desc: "Comprehensive testing - bugs everywhere!",
        difficulty: "⭐⭐⭐⭐",
        theme: "Writing unit tests, integration tests, and debugging",
        paths: [
            [
                { x: 0, y: 100 },
                { x: 150, y: 100 },
                { x: 150, y: 200 },
                { x: 300, y: 200 },
                { x: 300, y: 300 },
                { x: 600, y: 300 },
                { x: 750, y: 250 }
            ],
            [
                { x: 0, y: 300 },
                { x: 100, y: 300 },
                { x: 100, y: 400 },
                { x: 250, y: 400 },
                { x: 250, y: 300 },
                { x: 600, y: 300 },
                { x: 750, y: 250 }
            ],
            [
                { x: 0, y: 500 },
                { x: 200, y: 500 },
                { x: 200, y: 350 },
                { x: 400, y: 350 },
                { x: 400, y: 300 },
                { x: 600, y: 300 },
                { x: 750, y: 250 }
            ]
        ],
        spawns: [
            { x: 0, y: 100, pathIndex: 0 },
            { x: 0, y: 300, pathIndex: 1 },
            { x: 0, y: 500, pathIndex: 2 }
        ]
    },
    {
        name: "Production Deployment",
        desc: "Going live - maximum chaos!",
        difficulty: "⭐⭐⭐⭐⭐",
        theme: "Deploying to production and handling real users",
        paths: [
            [
                { x: 0, y: 80 },
                { x: 120, y: 80 },
                { x: 120, y: 180 },
                { x: 300, y: 180 },
                { x: 300, y: 280 },
                { x: 650, y: 280 },
                { x: 750, y: 250 }
            ],
            [
                { x: 0, y: 220 },
                { x: 180, y: 220 },
                { x: 180, y: 280 },
                { x: 650, y: 280 },
                { x: 750, y: 250 }
            ],
            [
                { x: 0, y: 380 },
                { x: 150, y: 380 },
                { x: 150, y: 320 },
                { x: 450, y: 320 },
                { x: 450, y: 280 },
                { x: 650, y: 280 },
                { x: 750, y: 250 }
            ],
            [
                { x: 0, y: 520 },
                { x: 250, y: 520 },
                { x: 250, y: 420 },
                { x: 500, y: 420 },
                { x: 500, y: 320 },
                { x: 450, y: 320 },
                { x: 450, y: 280 },
                { x: 650, y: 280 },
                { x: 750, y: 250 }
            ]
        ],
        spawns: [
            { x: 0, y: 80, pathIndex: 0 },
            { x: 0, y: 220, pathIndex: 1 },
            { x: 0, y: 380, pathIndex: 2 },
            { x: 0, y: 520, pathIndex: 3 }
        ]
    }
];

// Current game path (will be set based on selected map)
let currentGamePath = maps[0].paths[0]; // Default to first map

// Friend types with color coordination - Updated with special abilities
const friendTypes = {
    dario: {
        cost: 50, damage: 15, range: 100, fireRate: 1000, color: '#FF9800',
        special: 'family_photo',
        strong: [], weak: [],
        upgrades: ['damage', 'rate', 'range'],
        desc: 'Family photo master! Click for group photo (pauses all enemies 3s, once per wave).',
        category: 'professional-counter'
    },
    tony: {
        cost: 120, damage: 22, range: 110, fireRate: 1200, color: '#9C27B0',
        special: 'moveable',
        strong: ['intern', 'coworker'], weak: ['boss', 'karen', 'networker'],
        upgrades: ['slow', 'damage', 'nerd_boost'],
        desc: 'Star Wars specialist! "Hey I\'m coming to visit" - can move once per wave.',
        category: 'star-wars-specialist'
    },
    sophia: {
        cost: 180, damage: 16, range: 150, fireRate: 600, color: '#FF9800',
        special: 'listener',
        strong: ['oversharer', 'elderly'], weak: ['intern', 'performer'],
        upgrades: ['heal', 'range', 'empathy'],
        desc: 'Premium support specialist. Heals and boosts nearby friends.',
        category: 'support-specialist'
    },
    max: {
        cost: 160, damage: 45, range: 130, fireRate: 2000, color: '#E91E63',
        special: 'music_single',
        strong: ['performer', 'gymguy'], weak: ['boss', 'karen', 'uncle'],
        upgrades: ['wide', 'damage', 'bass'],
        desc: 'Slow but devastating single-target music specialist.',
        category: 'charm-specialist'
    },
    junior: {
        cost: 90, damage: 18, range: 220, fireRate: 800, color: '#4CAF50',
        special: 'trivia_range',
        strong: ['elderly', 'uncle', 'bartender'], weak: ['intern', 'performer'],
        upgrades: ['range', 'trivia', 'boring'],
        desc: 'Long-range trivia bombardment. Elderly love his stories.',
        category: 'nature-specialist'
    },
    sao: {
        cost: 140, damage: 0, range: 130, fireRate: 600, color: '#00BCD4',
        special: 'slow_only',
        strong: ['intern', 'performer', 'elevator'], weak: ['boss', 'karen'],
        upgrades: ['slow', 'damage', 'freeze'],
        desc: 'Pure slowdown specialist. Needs damage upgrade to attack.',
        category: 'speed-specialist'
    },
    po: {
        cost: 110, damage: 0, range: 140, fireRate: 800, color: '#9C27B0',
        special: 'conspiracy_only',
        strong: ['neighbor', 'uber', 'clerk'], weak: ['boss', 'networker', 'karen'],
        upgrades: ['conspiracy', 'damage', 'convert'],
        desc: 'Conspiracy slowdown specialist. Needs damage upgrade to attack.',
        category: 'nerd-specialist'
    },
    wrenly: {
        cost: 170, damage: 28, range: 150, fireRate: 900, color: '#E91E63',
        special: 'cuteness_wide',
        strong: ['neighbor', 'clerk', 'uber', 'elderly'], weak: ['boss', 'karen'],
        upgrades: ['cute', 'wide', 'charm'],
        desc: 'Premium cuteness specialist with AOE charm.',
        category: 'charm-specialist'
    },
    drea: {
        cost: 65, damage: 8, range: 90, fireRate: 250, color: '#00BCD4',
        special: 'fasttalk',
        strong: ['neighbor', 'clerk'], weak: ['boss', 'uncle', 'bartender'],
        upgrades: ['speed', 'damage', 'caffeine'],
        desc: 'Speed talker with rapid-fire low damage. Great vs weak enemies.',
        category: 'speed-specialist'
    },
    ruel: {
        cost: 130, damage: 35, range: 120, fireRate: 1400, color: '#4CAF50',
        special: 'train_rampage',
        strong: ['bartender', 'elderly'], weak: ['intern', 'performer'],
        upgrades: ['damage', 'boring', 'trains'],
        desc: 'Premium train specialist. Click for TRAIN RAMPAGE! (once per wave)',
        category: 'nature-specialist'
    },
    nicole: {
        cost: 125, damage: 24, range: 200, fireRate: 700, color: '#4CAF50',
        special: 'flowers_range',
        strong: ['elderly', 'neighbor', 'karen'], weak: ['boss', 'networker'],
        upgrades: ['range', 'nature', 'calming'],
        desc: 'Premium long-range flower wisdom specialist.',
        category: 'nature-specialist'
    },
    maddie: {
        cost: 95, damage: 12, range: 120, fireRate: 900, color: '#3F51B5',
        special: 'student_experience',
        strong: ['intern', 'clerk'], weak: ['boss', 'uncle', 'bartender'],
        upgrades: ['study', 'experience', 'wisdom'],
        desc: 'Student who gets stronger over time. Learns from every interaction!',
        category: 'scholar-specialist',
        experienceLevel: 0, // Special property for scaling
        maxExperience: 10
    },
    aviva: {
        cost: 140, damage: 20, range: 140, fireRate: 1100, color: '#FF6B9D',
        special: 'singing_stun',
        strong: ['performer', 'elderly', 'neighbor'], weak: ['boss', 'networker'],
        upgrades: ['harmony', 'volume', 'repertoire'],
        desc: 'Beautiful singing voice that mesmerizes and stuns nearby enemies.',
        category: 'musical-specialist'
    },
    oise: {
        cost: 105, damage: 30, range: 80, fireRate: 1300, color: '#795548',
        special: 'grapple_close',
        strong: ['gymguy', 'performer', 'elevator'], weak: ['elderly', 'networker'],
        upgrades: ['strength', 'grapple', 'listening'],
        desc: 'Great listener who can wrestle down enemies when things get intense.',
        category: 'grappler-specialist'
    }
};

// Enemy types with color coordination
const enemyTypes = {
    // Basic (1 person each) - Light colors
    neighbor: { health: 30, speed: 1, reward: 10, socialDamage: 1, color: '#FFE082', name: 'Chatty Neighbor', icon: '🏠', desc: 'Wants to talk about the weather and property values.', category: 'gullible' },
    clerk: { health: 25, speed: 1.2, reward: 8, socialDamage: 1, color: '#A5D6A7', name: 'Retail Clerk', icon: '🛍️', desc: 'Did you find everything you need today?', category: 'gullible' },
    uber: { health: 35, speed: 0.8, reward: 12, socialDamage: 1, color: '#90CAF9', name: 'Uber Driver', icon: '🚗', desc: 'Trapped audience who wants to share life philosophy.', category: 'gullible' },

    // Medium (1.5 people each) - Medium colors
    performer: { health: 40, speed: 1.8, reward: 18, socialDamage: 1.5, color: '#CE93D8', name: 'Street Performer', icon: '🎭', desc: 'High energy entertainer demanding audience participation.', category: 'energetic' },
    elderly: { health: 50, speed: 0.6, reward: 22, socialDamage: 1.5, color: '#BCAAA4', name: 'Elderly Storyteller', icon: '👴', desc: 'Has many stories from "back in my day".', category: 'patient' },
    gymguy: { health: 55, speed: 1.4, reward: 20, socialDamage: 1.5, color: '#FFAB91', name: 'Gym Regular', icon: '💪', desc: 'Wants to discuss your workout routine and protein intake.', category: 'energetic' },

    // High (2-3 people each) - Dark colors
    boss: { health: 80, speed: 0.9, reward: 28, socialDamage: 2.5, color: '#F48FB1', name: 'Boss', icon: '💼', desc: 'Needs to circle back and touch base about synergies.', category: 'professional' },
    evangelist: { health: 70, speed: 1.1, reward: 26, socialDamage: 2, color: '#FFF176', name: 'Evangelist', icon: '📖', desc: 'Very persistent about sharing good news.', category: 'persistent' },
    oversharer: { health: 60, speed: 1.2, reward: 22, socialDamage: 2, color: '#FFAB91', name: 'Oversharer', icon: '😭', desc: 'Dumps entire relationship history on strangers.', category: 'emotional' },
    networker: { health: 75, speed: 1.5, reward: 32, socialDamage: 3, color: '#80CBC4', name: 'Networking Enthusiast', icon: '🤝', desc: 'Wants to grab coffee and ideate some solutions.', category: 'professional' },
    bartender: { health: 85, speed: 0.7, reward: 30, socialDamage: 2.5, color: '#E6EE9C', name: 'Bartender', icon: '🍺', desc: 'Professional conversationalist with endless small talk.', category: 'patient' },
    coworker: { health: 65, speed: 1, reward: 25, socialDamage: 2, color: '#B39DDB', name: 'Bad Code Coworker', icon: '💻', desc: 'Submits terrible code and wants you to fix it.', category: 'nerdy' },
    intern: { health: 45, speed: 2, reward: 20, socialDamage: 2, color: '#FFCC80', name: 'Clueless Intern', icon: '🤷', desc: 'Asks endless questions and follows you around.', category: 'nerdy' },

    // Special/Boss enemies - Very dark colors
    elevator: { health: 40, speed: 2.2, reward: 18, socialDamage: 1.5, color: '#D1C4E9', name: 'Elevator Person', icon: '🏢', desc: 'Awkward small talk in confined vertical space.', category: 'fast' },
    uberboss: { health: 200, speed: 0.5, reward: 80, socialDamage: 5, color: '#1565C0', name: 'Uber Driver Boss', icon: '🚙', desc: 'Ultimate captive audience nightmare with strong opinions.', category: 'boss' },
    karen: { health: 250, speed: 0.6, reward: 100, socialDamage: 7, color: '#AD1457', name: 'Karen Manager Meeting', icon: '👩‍💼', desc: 'Meeting that could have been an email but wants face time.', category: 'boss' },
    uncle: { health: 220, speed: 0.4, reward: 90, socialDamage: 6, color: '#5D4037', name: 'Family Reunion Uncle', icon: '👨‍🦳', desc: 'Strong political opinions and vacation slideshow ready.', category: 'boss' }
};

// Wave configurations
const waveConfigs = [
    { enemies: ['neighbor', 'clerk'], count: 3, name: 'Monday Morning', desc: 'Just some basic social interactions to start the day.' },
    { enemies: ['neighbor', 'clerk', 'uber'], count: 4, name: 'Grocery Run', desc: 'Running errands exposes you to more people.' },
    { enemies: ['performer', 'elderly'], count: 4, name: 'Park Walk', desc: 'Street performers and chatty elderly folks.' },
    { enemies: ['gymguy', 'performer', 'clerk'], count: 5, name: 'Gym Time', desc: 'That regular who always talks about reps.' },
    { enemies: ['boss', 'coworker'], count: 3, name: 'Work Meeting', desc: 'Corporate buzzwords incoming!' },
    { enemies: ['evangelist', 'oversharer', 'neighbor'], count: 5, name: 'Community Event', desc: 'People really want to share their feelings.' },
    { enemies: ['bartender', 'networker'], count: 4, name: 'Happy Hour', desc: 'Professional social pressure intensifies.' },
    { enemies: ['intern', 'coworker', 'boss'], count: 5, name: 'Code Review', desc: 'Why did the intern submit 200 lines of console.log?' },
    { enemies: ['elevator', 'elevator', 'networker'], count: 4, name: 'Office Building', desc: 'Awkward elevator small talk multiplied.' },
    { enemies: ['uberboss'], count: 1, name: 'Rush Hour Nightmare', desc: 'Trapped in a car with a chatty driver.' },
    { enemies: ['elderly', 'oversharer', 'uncle'], count: 4, name: 'Family Gathering', desc: 'Uncle has strong opinions about everything.' },
    { enemies: ['karen'], count: 1, name: 'Corporate Meeting', desc: 'A meeting that could have been an email.' }
];

// Upgrade definitions
const upgradeOptions = {
    damage: { name: 'More Damage', cost: 60, desc: '+50% damage', icon: '💥' },
    rate: { name: 'Faster Fire', cost: 50, desc: '+40% fire rate', icon: '⚡' },
    range: { name: 'Longer Range', cost: 65, desc: '+30% range', icon: '🎯' },
    wide: { name: 'Wider Area', cost: 80, desc: '+50% AOE range', icon: '💥' },
    slow: { name: 'Better Slow', cost: 55, desc: 'Stronger slow effect', icon: '🐌' },
    heal: { name: 'Better Support', cost: 70, desc: '2x healing effect', icon: '💚' },
    nerd_boost: { name: 'Nerd Mastery', cost: 70, desc: '3x damage vs nerdy enemies', icon: '🤓' },
    conspiracy: { name: 'Deep State', cost: 60, desc: 'Converts enemies to allies', icon: '👁️' },
    cute: { name: 'Ultra Cute', cost: 75, desc: 'Stuns enemies briefly', icon: '🥺' },
    speed: { name: 'Caffeine Rush', cost: 50, desc: '3x fire rate', icon: '☕' },
    boring: { name: 'Ultra Boring', cost: 65, desc: 'Puts enemies to sleep', icon: '😴' },
    nature: { name: 'Mother Nature', cost: 70, desc: 'Summons nature allies', icon: '🌿' },
    empathy: { name: 'Deep Empathy', cost: 65, desc: 'Converts enemies to friends', icon: '❤️' },
    bass: { name: 'Bass Drop', cost: 75, desc: 'Stuns all nearby enemies', icon: '🔊' },
    trivia: { name: 'Trivia Master', cost: 60, desc: 'Boring trivia slows enemies', icon: '🧠' },
    freeze: { name: 'Time Freeze', cost: 80, desc: 'Completely stops enemies', icon: '❄️' },
    convert: { name: 'True Believer', cost: 70, desc: 'Converts enemies to fight for you', icon: '🧠' },
    charm: { name: 'Irresistible Charm', cost: 65, desc: 'Charms enemies to walk backward', icon: '😍' },
    caffeine: { name: 'Infinite Caffeine', cost: 55, desc: 'Never stops talking', icon: '☕' },
    trains: { name: 'Train Encyclopedia', cost: 70, desc: 'Double train rampage power and trains!', icon: '🚂' },
    calming: { name: 'Zen Master', cost: 60, desc: 'Calms enemies into sleep', icon: '🧘' },
    study: { name: 'Study Harder', cost: 50, desc: 'Faster experience gain', icon: '📚' },
    experience: { name: 'Life Experience', cost: 65, desc: 'Starts with 5 experience levels', icon: '🎓' },
    wisdom: { name: 'Ancient Wisdom', cost: 70, desc: 'Max experience gives massive damage boost', icon: '🧠' },
    harmony: { name: 'Perfect Harmony', cost: 60, desc: 'Stuns last longer and affect more enemies', icon: '🎵' },
    volume: { name: 'Amplified Voice', cost: 55, desc: 'Singing range and damage increased', icon: '🔊' },
    repertoire: { name: 'Full Repertoire', cost: 70, desc: 'Multiple song effects and faster cooldown', icon: '🎼' },
    strength: { name: 'Wrestling Training', cost: 65, desc: 'Can grapple multiple enemies at once', icon: '💪' },
    grapple: { name: 'Master Grappler', cost: 60, desc: 'Longer grapple duration and stronger hold', icon: '🤼' },
    listening: { name: 'Active Listening', cost: 55, desc: 'Heals nearby friends while grappling', icon: '👂' }
};

let currentSlotToDelete = null;
let currentSaveSlot = null;

// Speech bubble system
class SpeechBubble {
    constructor(x, y, message) {
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

        // --- Styling ---
        const fontSize = 12;
        ctx.font = `${fontSize}px Courier New`;
        ctx.textBaseline = 'top';
        const textColor = '#00ff41';
        const bgColor = 'rgba(0,0,0,0.9)';
        const borderColor = '#00ff41';
        const padding = 8;
        const pointerH = 10;
        const maxBubbleWidth = 200;   // you can tweak this

        // --- Wrap text into lines ---
        const words = this.message.split(' ');
        const lines = [];
        let line = '';

        for (let word of words) {
            const testLine = line ? (line + ' ' + word) : word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width + padding * 2 > maxBubbleWidth) {
                // current line is full
                if (line) lines.push(line);
                line = word;
            } else {
                line = testLine;
            }
        }
        if (line) lines.push(line);

        // --- Compute bubble size ---
        let bubbleWidth = 0;
        for (let l of lines) {
            const w = ctx.measureText(l).width;
            if (w > bubbleWidth) bubbleWidth = w;
        }
        bubbleWidth += padding * 2;
        const lineHeight = fontSize * 1.2;
        const bubbleHeight = lines.length * lineHeight + padding * 2;

        // --- Clamp bubble position ---
        const halfW = bubbleWidth / 2;
        // desired anchor is bottom-center at (this.x, this.y)
        let bx = this.x;
        if (bx - halfW < 0) bx = halfW;
        else if (bx + halfW > canvas.width) bx = canvas.width - halfW;

        // desired top-left y is this.y - pointerH - bubbleHeight
        let by = this.y - pointerH - bubbleHeight;
        if (by < 0) by = 0;
        else if (by + bubbleHeight + pointerH > canvas.height) {
            // if it would go below viewport, bump it up
            by = canvas.height - bubbleHeight - pointerH;
        }

        // --- Draw bubble rect ---
        ctx.fillStyle = bgColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        ctx.fillRect(bx - halfW, by, bubbleWidth, bubbleHeight);
        ctx.strokeRect(bx - halfW, by, bubbleWidth, bubbleHeight);

        // --- Draw pointer ---
        const px = this.x;
        const py = by + bubbleHeight;
        ctx.beginPath();
        ctx.moveTo(px - pointerH, py);
        ctx.lineTo(px, py + pointerH);
        ctx.lineTo(px + pointerH, py);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // --- Draw text lines ---
        ctx.fillStyle = textColor;
        for (let i = 0; i < lines.length; i++) {
            const textX = bx;
            const textY = by + padding + i * lineHeight;
            ctx.fillText(lines[i], textX, textY);
        }

        ctx.globalAlpha = 1;
    }

}

function addSpeechBubble(x, y, message) {
    gameState.speechBubbles.push(new SpeechBubble(x, y, message));
}

function familyPhoto() {
    // Pause all enemies for 3 seconds
    for (let enemy of gameState.enemies) {
        if (enemy.alive && !enemy.converted) {
            enemy.stun(180); // 3 seconds at 60fps
        }
    }
    addSpeechBubble(400, 200, "Family photo time! Everyone smile! 📷");
    showNotification("Dario's family photo paused all enemies!");
}

function trainRampage(ruelFriend) {
    const currentMap = maps[gameState.currentMap];
    const spawnYOffsets = [-30, 30];

    // 1. Randomly pick a path instead of always the closest
    const randomPath = currentMap.paths[Math.floor(Math.random() * currentMap.paths.length)];

    // Find closest segment on the selected path
    let best = { dist: Infinity, idx: 0 };
    for (let i = 0; i < randomPath.length - 1; i++) {
        const a = randomPath[i], b = randomPath[i + 1];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const d = Math.hypot(ruelFriend.x - mx, ruelFriend.y - my);
        if (d < best.dist) best = { dist: d, idx: i };
    }

    // 2. Determine how many trains and their damage
    const isUpgraded = ruelFriend.upgrades.includes('trains');
    const trainCount = isUpgraded ? 2 : 1;
    const trainDamage = isUpgraded ? 120 : 80;

    // 3. Spawn trains on the randomly selected path
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


// Train rampage class for Ruel's special ability
class Train {

    constructor(startX, startY) {  // Remove direction parameter
        this.x = startX;
        this.y = startY;
        // Remove this.direction
        this.speed = 4;
        this.damage = 80;
        this.width = 60;  // Make it consistent size
        this.height = 40;
        this.life = 200;
        this.maxLife = 300;
        this.hitEnemies = new Set();

        // Add path-following properties like enemies have
        this.path = null;           // Will be set by trainRampage
        this.nextWaypoint = 0;      // Current target waypoint index
        this.pathComplete = false;  // Track if train finished the path
        this.goingBackwards = false;  // New flag for direction
    }

    update() {
        this.life -= gameState.gameSpeed;

        // Path-following movement
        if (this.path && !this.pathComplete) {
            const target = this.path[this.nextWaypoint];

            if (target) {
                // Move towards current target waypoint
                const dx = target.x - this.x;
                const dy = target.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 8) {  // Reached current waypoint
                    if (this.goingBackwards) {
                        this.nextWaypoint--;  // Go to previous waypoint
                        if (this.nextWaypoint < 0) {
                            this.pathComplete = true;  // Reached start of path
                        }
                    } else {
                        this.nextWaypoint++;  // Go to next waypoint (original behavior)
                        if (this.nextWaypoint >= this.path.length) {
                            this.pathComplete = true;  // Reached end of path
                        }
                    }
                } else {
                    // Move towards target
                    const moveSpeed = this.speed * gameState.gameSpeed;
                    this.x += (dx / distance) * moveSpeed;
                    this.y += (dy / distance) * moveSpeed;
                }
            }
        }

        // Rest of collision detection stays the same...
        for (let enemy of gameState.enemies) {
            if (!enemy.alive || enemy.converted || this.hitEnemies.has(enemy)) continue;

            // Simplified collision - just check distance
            const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
            if (distance < 30) {  // Collision radius
                this.hitEnemies.add(enemy);
                enemy.takeDamage(this.damage, 'train');
                addSpeechBubble(enemy.x, enemy.y - 30, "CHOO CHOO! 🚂");

                // Create explosion effect
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

        // Train body
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        // Train border
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

        // Train emoji
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🚂', this.x, this.y + 7);

        // Steam trail - calculate direction based on next waypoint
        let trailDx = 15, trailDy = 0;  // Default trail direction

        if (this.path && this.nextWaypoint >= 0 && this.nextWaypoint < this.path.length) {
            const target = this.path[this.nextWaypoint];
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                // Trail goes opposite to movement direction
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
        // return this.life > 0 && (this.x < canvas.width + 100) && (this.y < canvas.height + 100);
        return this.life > 0 && !this.pathComplete;
    }
}

class Banana {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8 - 2;
        this.gravity = 0.3;
        this.life = 60;
        this.maxLife = 60;
    }

    update() {
        this.x += this.vx * gameState.gameSpeed;
        this.y += this.vy * gameState.gameSpeed;
        this.vy += this.gravity * gameState.gameSpeed;
        this.life -= gameState.gameSpeed;
    }

    draw() {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#FFEB3B';
        ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
        ctx.globalAlpha = 1;
    }
}

class Enemy {
    constructor(type) {
        const enemyType = enemyTypes[type];
        this.type = type;

        // Health scaling
        const healthScale = Math.pow(1.15, gameState.wave - 1);
        this.maxHealth = Math.floor(enemyType.health * healthScale);
        this.health = this.maxHealth;

        // Speed scaling
        this.baseSpeed = enemyType.speed * (1 + (gameState.wave - 1) * 0.03);
        this.speed = this.baseSpeed;
        this.reward = Math.floor(enemyType.reward * (1 + (gameState.wave - 1) * 0.05));
        this.socialDamage = enemyType.socialDamage;
        this.color = enemyType.color;
        this.name = enemyType.name;
        this.icon = enemyType.icon;

        // NEW: Handle multiple spawn points and paths
        const currentMap = maps[gameState.currentMap];
        const spawnPoint = currentMap.spawns[Math.floor(Math.random() * currentMap.spawns.length)];
        this.currentPath = currentMap.paths[spawnPoint.pathIndex];

        this.x = spawnPoint.x - 30; // Start before spawn point
        this.y = spawnPoint.y;
        this.pathIndex = 0;
        this.alive = true;
        this.slowEffect = 0;
        this.stunned = 0;
        this.converted = false;
        this.reachedEnd = false;
        this.grappled = false; // New: For Oise's grappling ability
        this.grappleStun = 0; // New: Duration of grapple stun
    }

    update() {
        if (!this.alive || gameState.gameOver) return;

        // Handle stun
        if (this.stunned > 0) {
            this.stunned -= gameState.gameSpeed;
            return;
        }

        // Handle grappling (Oise's special ability)
        if (this.grappled && this.grappleStun > 0) {
            this.grappleStun -= gameState.gameSpeed;
            if (this.grappleStun <= 0) {
                this.grappled = false;
            }
            return; // Can't move while grappled
        }

        // Apply slow effect
        this.speed = this.baseSpeed;
        if (this.slowEffect > 0) {
            this.speed *= 0.3; // 70% speed reduction when slowed
            this.slowEffect -= gameState.gameSpeed;
        }

        // Apply game speed
        const currentSpeed = this.speed * gameState.gameSpeed;

        // Move towards next path point
        let targetIndex = this.converted ? Math.max(0, this.pathIndex - 1) : this.pathIndex + 1;
        const target = this.currentPath[targetIndex];

        if (!target) {
            if (this.converted) {
                // Converted enemy reached start, remove safely
                this.alive = false;
                return;
            } else {
                // Enemy reached Ben's tower - DEAL SOCIAL DAMAGE!
                if (!this.reachedEnd) {
                    this.reachedEnd = true;
                    addSpeechBubble(this.x, this.y - 30, `${this.name} drained ${this.socialDamage} social energy!`);

                    // CRITICAL: Actually reduce health!
                    gameState.health = Math.max(0, gameState.health - this.socialDamage);

                    // Check for game over
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

        // Enemy body with color coordination
        ctx.fillStyle = this.converted ? '#00ff41' : this.color;
        if (this.type === 'karen' || this.type === 'uberboss' || this.type === 'uncle') {
            // Boss enemies are bigger
            ctx.fillRect(this.x - 12, this.y - 12, 24, 24);
        } else {
            ctx.fillRect(this.x - 8, this.y - 8, 16, 16);
        }

        // Add visual indicators
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.icon, this.x, this.y + 4);

        // Health bar
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 12, this.y - 18, 24, 4);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 12, this.y - 18, 24 * healthPercent, 4);

        // Effect indicators
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

    takeDamage(damage, attackerType) {
        if (!this.alive || this.converted) return;

        let finalDamage = damage;

        // Calculate effectiveness multipliers
        const friendData = friendTypes[attackerType];
        if (friendData) {
            if (friendData.strong.includes(this.type)) {
                finalDamage *= 2; // 2x damage vs strong matchups
            } else if (friendData.weak.includes(this.type)) {
                finalDamage *= 0.5; // 0.5x damage vs weak matchups
            }
        }

        this.health -= finalDamage;
        if (this.health <= 0) {
            this.alive = false;
            gameState.money += this.reward;
            gameState.score += this.reward;
            gameState.totalEnemiesDefeated++;

            // Create banana explosion
            for (let i = 0; i < 8; i++) {
                gameState.bananas.push(new Banana(this.x, this.y));
            }

            updateUI();
        }
    }

    applySlow(duration) {
        this.slowEffect = Math.max(this.slowEffect, duration);
    }

    stun(duration) {
        this.stunned = Math.max(this.stunned, duration);
    }

    convert() {
        this.converted = true;
        this.color = '#00ff41';
    }
}

class Friend {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.stats = JSON.parse(JSON.stringify(friendTypes[type])); // Deep copy
        this.lastShot = 0;
        this.target = null;
        this.specialCooldown = 0;
        this.upgrades = [];

        // Special properties for new friends
        if (type === 'maddie') {
            this.experienceLevel = 0;
            this.maxExperience = 10;
            this.experienceGain = 0; // Track experience from nearby kills
        }
        if (type === 'oise') {
            this.grappledEnemies = []; // Track grappled enemies
        }
    }

    update() {
        if (gameState.gameOver) return;

        // Special update for Maddie's experience system
        if (this.type === 'maddie') {
            this.updateMaddieExperience();
        }

        // Special update for Oise's grappling
        if (this.type === 'oise') {
            this.updateOiseGrappling();
        }

        // Find closest enemy in range
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

        // Attack target (adjust fire rate for game speed)
        const adjustedFireRate = this.stats.fireRate / gameState.gameSpeed;
        if (this.target && Date.now() - this.lastShot > adjustedFireRate) {
            this.attack();
            this.lastShot = Date.now();
        }

        // Special abilities
        if (this.specialCooldown > 0) this.specialCooldown -= gameState.gameSpeed;
        this.useSpecialAbility();
    }

    updateMaddieExperience() {
        // Maddie gains experience from nearby enemy defeats
        const experienceRadius = 150;
        let newExperience = 0;

        for (let enemy of gameState.enemies) {
            if (!enemy.alive && enemy.justDied) {
                const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
                if (distance < experienceRadius) {
                    newExperience += 1;
                }
            }
        }

        if (newExperience > 0 && this.experienceLevel < this.maxExperience) {
            this.experienceLevel = Math.min(this.maxExperience, this.experienceLevel + newExperience);

            // Scale damage based on experience
            const baseDamage = friendTypes.maddie.damage;
            const experienceMultiplier = 1 + (this.experienceLevel * 0.15); // 15% per level
            this.stats.damage = Math.floor(baseDamage * experienceMultiplier);

            if (this.experienceLevel === this.maxExperience) {
                addSpeechBubble(this.x, this.y - 30, "Maddie graduated! 🎓");
            }
        }
    }

    updateOiseGrappling() {
        // Update grappled enemies - remove dead ones, tick down timers
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

        // Special case: Sao and Pō only slow unless they have damage upgrade
        if ((this.stats.special === 'slow_only' || this.stats.special === 'conspiracy_only') &&
            !this.upgrades.includes('damage')) {
            // They just slow, no projectile
            return;
        }

        if (this.stats.special.includes('wide') && this.upgrades.includes('wide')) {
            // Wideshot attack (only if upgraded for AOE)
            this.wideshotAttack();
        } else {
            // Normal projectile
            gameState.projectiles.push(new Projectile(
                this.x, this.y, this.target, this.stats.damage, this.type
            ));
        }
    }

    wideshotAttack() {
        // Hit all enemies in range
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
                // Sophia heals nearby friends
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
                // Sao's pure slowdown
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
                // Pō's conspiracy theories
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
                    // Regular conspiracy slow
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
                // Wrenly stuns if upgraded
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
                // Aviva's singing stuns enemies
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
                // Oise's grappling ability
                const grappleRange = 60; // Very short range
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

                // Active listening healing while grappling
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
        return this.upgrades.length < 2; // Max 2 upgrades per friend
    }

    upgrade(upgradeType) {
        if (!this.canUpgrade() || this.upgrades.includes(upgradeType)) return false;

        this.upgrades.push(upgradeType);

        // Apply upgrade effects
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
            // New upgrade effects for new friends
            case 'study':
                if (this.type === 'maddie') {
                    this.experienceGainRate = 2; // Double experience gain
                }
                break;
            case 'experience':
                if (this.type === 'maddie') {
                    this.experienceLevel = Math.min(this.maxExperience, this.experienceLevel + 5);
                }
                break;
            case 'wisdom':
                if (this.type === 'maddie') {
                    this.maxExperience = 15; // Can go beyond normal max
                }
                break;
            case 'harmony':
                // Handled in useSpecialAbility for Aviva
                break;
            case 'volume':
                if (this.type === 'aviva') {
                    this.stats.range = Math.floor(this.stats.range * 1.4);
                    this.stats.damage = Math.floor(this.stats.damage * 1.3);
                }
                break;
            case 'repertoire':
                // Handled in useSpecialAbility for Aviva
                break;
            case 'strength':
                // Handled in useSpecialAbility for Oise
                break;
            case 'grapple':
                // Handled in useSpecialAbility for Oise
                break;
            case 'listening':
                // Handled in useSpecialAbility for Oise
                break;
        }

        return true;
    }

    draw() {
        // Friend body with color coordination
        ctx.fillStyle = this.stats.color;
        ctx.fillRect(this.x - 15, this.y - 15, 30, 30);

        // Add a border to make it more visible
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - 15, this.y - 15, 30, 30);

        // Special ability indicators
        if (this.type === 'dario' && !gameState.darioPhotoUsed) {
            // Photo button indicator
            ctx.fillStyle = 'yellow';
            ctx.fillRect(this.x - 20, this.y - 20, 10, 10);
            ctx.fillStyle = 'black';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('📷', this.x - 15, this.y - 13);
        }

        if (this.type === 'tony' && !gameState.tonyMoveUsed) {
            // Move indicator
            ctx.fillStyle = 'cyan';
            ctx.fillRect(this.x + 10, this.y - 20, 10, 10);
            ctx.fillStyle = 'black';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('➤', this.x + 15, this.y - 13);
        }

        if (this.type === 'ruel' && !gameState.trainRampageUsed) {
            // Train rampage indicator
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(this.x - 20, this.y + 10, 10, 10);
            ctx.fillStyle = 'white';
            ctx.font = '8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🚂', this.x - 15, this.y + 17);
        }

        // Maddie's experience level indicator
        if (this.type === 'maddie') {
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

        // Aviva's singing indicator (when on cooldown)
        if (this.type === 'aviva' && this.specialCooldown > 0) {
            ctx.fillStyle = '#FF6B9D';
            ctx.fillText('♪', this.x - 20, this.y - 20);
        }

        // Oise's grapple count indicator
        if (this.type === 'oise' && this.grappledEnemies && this.grappledEnemies.length > 0) {
            ctx.fillStyle = '#795548';
            ctx.fillText(`🤼${this.grappledEnemies.length}`, this.x + 15, this.y - 20);
        }

        // Upgrade indicators
        if (this.upgrades.length > 0) {
            ctx.fillStyle = 'gold';
            for (let i = 0; i < this.upgrades.length; i++) {
                ctx.fillRect(this.x - 18 + i * 8, this.y - 18, 6, 6);
            }
        }

        // Friend identifier
        ctx.fillStyle = 'white';
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.type.toUpperCase(), this.x, this.y + 2);

        // Range indicator when placing
        if (gameState.selectedFriend === this.type) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.stats.range, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

class Projectile {
    constructor(x, y, target, damage, attackerType) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.attackerType = attackerType;
        this.speed = 7;
        this.alive = true;
    }

    update() {
        if (!this.alive || !this.target.alive || this.target.converted || gameState.gameOver) {
            this.alive = false;
            return;
        }

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 10) {
            // Hit target
            this.target.takeDamage(this.damage, this.attackerType);
            this.alive = false;
        } else {
            const moveSpeed = this.speed * gameState.gameSpeed;
            this.x += (dx / distance) * moveSpeed;
            this.y += (dy / distance) * moveSpeed;
        }
    }

    draw() {
        if (!this.alive) return;

        const friendData = friendTypes[this.attackerType];
        ctx.fillStyle = friendData ? friendData.color : '#00FF00';
        ctx.fillRect(this.x - 3, this.y - 3, 6, 6);
    }
}

function drawPath() {
    if (!gameState.mapSelected) return;

    const currentMap = maps[gameState.currentMap];

    // Draw all paths for current map
    for (let pathIndex = 0; pathIndex < currentMap.paths.length; pathIndex++) {
        const path = currentMap.paths[pathIndex];

        // Draw path background
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 30;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();

        // Path borders
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Draw spawn points
    for (let spawn of currentMap.spawns) {
        ctx.fillStyle = '#FF4500';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SPAWN', spawn.x + 60, spawn.y + 5);
    }

    // Ben's tower at the end (same for all maps)
    const benPosition = { x: 750, y: 250 };
    ctx.fillStyle = gameState.health <= 5 ? '#ff4757' : '#00ff41';
    ctx.fillRect(benPosition.x - 25, benPosition.y - 25, 50, 50);
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BEN', benPosition.x, benPosition.y - 5);
    ctx.fillText('🧑‍💻', benPosition.x, benPosition.y + 15);
}

// FIXED: Make sure startGame is properly defined and accessible
function startGame() {
    // Close storyline modal
    const storylineModal = document.getElementById('storylineModal');
    if (storylineModal) storylineModal.style.display = 'none';

    // Restore game UI
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        gameContainer.style.opacity = '1';
        gameContainer.style.pointerEvents = 'auto';
    }

    // Show start game options (New Game vs Load Game)
    showStartGameOptions();
}

function showMapSelection() {
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

    if (mapModal) mapModal.style.display = 'flex';
}

function selectMap(mapIndex) {
    gameState.currentMap = mapIndex;
    gameState.mapSelected = true;
    gameState.gameStarted = true;

    const mapModal = document.getElementById('mapSelectionModal');
    if (mapModal) mapModal.style.display = 'none';

    // Update progress text based on selected map
    const progressText = document.getElementById('progressText');
    if (progressText) progressText.textContent = maps[mapIndex].theme;

    updateUI();
    console.log(`Selected map: ${maps[mapIndex].name}`);
}

function selectFriend(type) {
    if (gameState.money >= friendTypes[type].cost && !gameState.gameOver && gameState.gameStarted) {
        // Clear previous selection
        document.querySelectorAll('.friend-btn').forEach(btn => btn.classList.remove('selected'));

        gameState.selectedFriend = type;
        canvas.style.cursor = 'crosshair';
        const btn = document.getElementById(type + 'Btn');
        if (btn) btn.classList.add('selected');

        const cancelText = document.getElementById('cancelText');
        if (cancelText) cancelText.style.display = 'block';

        console.log(`Selected friend: ${type}`);
    }
}

function cancelSelection() {
    gameState.selectedFriend = null;
    canvas.style.cursor = 'default';
    document.querySelectorAll('.friend-btn').forEach(btn => btn.classList.remove('selected'));

    const cancelText = document.getElementById('cancelText');
    if (cancelText) cancelText.style.display = 'none';
}

function placeFriend(x, y) {
    if (!gameState.selectedFriend || gameState.gameOver) return;

    const friendType = friendTypes[gameState.selectedFriend];
    if (gameState.money < friendType.cost) return;

    // Check if position is valid
    if (isOnPath(x, y) || isOnFriend(x, y)) {
        showNotification('Cannot place here!');
        return;
    }

    console.log(`Placing ${gameState.selectedFriend} at ${x}, ${y}`);
    gameState.friends.push(new Friend(x, y, gameState.selectedFriend));
    gameState.money -= friendType.cost;
    cancelSelection();
    updateUI();
    console.log(`Total friends: ${gameState.friends.length}`);
}

function isOnPath(x, y) {
    if (!gameState.mapSelected) return false;

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

function isOnFriend(x, y) {
    return gameState.friends.some(friend =>
        Math.sqrt((friend.x - x) ** 2 + (friend.y - y) ** 2) < 35
    );
}

function distanceToLineSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (length * length)));
    const projection = { x: x1 + t * dx, y: y1 + t * dy };
    return Math.sqrt((px - projection.x) ** 2 + (py - projection.y) ** 2);
}

function toggleSpeed() {
    gameState.gameSpeed = gameState.gameSpeed === 1 ? 2 : 1;
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

function showWavePreview() {
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

        // Show enemy types
        const enemyCounts = {};
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
    if (waveModal) waveModal.style.display = 'flex';
}

function startNextWave() {
    if (gameState.waveActive || gameState.gameOver || !gameState.gameStarted || !gameState.mapSelected) return;
    showWavePreview();
}

function startWaveFromModal() {
    const waveModal = document.getElementById('waveModal');
    if (waveModal) waveModal.style.display = 'none';

    gameState.waveActive = true;
    gameState.enemiesSpawned = 0;

    const waveIndex = Math.min(gameState.wave - 1, waveConfigs.length - 1);
    const waveConfig = waveConfigs[waveIndex];

    // Scale enemy count
    const baseCount = waveConfig.count;
    const scaledCount = Math.floor(baseCount * Math.pow(1.1, gameState.wave - 1));
    gameState.enemiesRemaining = scaledCount;

    const baseSpawnDelay = Math.max(800, 1800 - gameState.wave * 50);
    const spawnDelay = baseSpawnDelay / gameState.gameSpeed;

    const spawnInterval = setInterval(() => {
        if (gameState.enemiesSpawned >= gameState.enemiesRemaining || gameState.gameOver) {
            clearInterval(spawnInterval);
            return;
        }

        const enemyType = waveConfig.enemies[gameState.enemiesSpawned % waveConfig.enemies.length];
        gameState.enemies.push(new Enemy(enemyType));
        gameState.enemiesSpawned++;
    }, spawnDelay);

    updateUI();
}

function showGameOver() {
    gameState.gameOver = true;
    console.log('Game Over triggered');

    const finalWave = document.getElementById('finalWave');
    if (finalWave) finalWave.textContent = gameState.wave;

    const finalScore = document.getElementById('finalScore');
    if (finalScore) finalScore.textContent = gameState.score;

    const totalEnemies = document.getElementById('totalEnemies');
    if (totalEnemies) totalEnemies.textContent = gameState.totalEnemiesDefeated;

    const gameOverModal = document.getElementById('gameOverModal');
    if (gameOverModal) gameOverModal.style.display = 'flex';
}

function updateCodingProgress() {
    if (gameState.wave <= 5) {
        gameState.codingProgress = (gameState.wave - 1) * 20;
        const progressText = document.getElementById('progressText');
        if (progressText) progressText.textContent = 'Setting up development environment...';
    } else if (gameState.wave <= 10) {
        gameState.codingProgress = 20 + (gameState.wave - 5) * 16;
        const progressText = document.getElementById('progressText');
        if (progressText) progressText.textContent = 'Writing core functions...';
    } else {
        gameState.codingProgress = 100;
        const progressText = document.getElementById('progressText');
        if (progressText) progressText.textContent = 'Deployed to production!';
    }

    const progressFill = document.getElementById('progressFill');
    if (progressFill) progressFill.style.width = gameState.codingProgress + '%';
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

function showUpgradeModal(friend) {
    gameState.selectedFriendForUpgrade = friend;

    const upgradeTitle = document.getElementById('upgradeTitle');
    if (upgradeTitle) upgradeTitle.textContent = `Upgrade ${friend.type.toUpperCase()}`;

    // Show current upgrades
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
    if (upgradeModal) upgradeModal.style.display = 'flex';
}

function applyUpgrade(upgradeType) {
    const friend = gameState.selectedFriendForUpgrade;
    const upgrade = upgradeOptions[upgradeType];

    if (gameState.money >= upgrade.cost && friend.upgrade(upgradeType)) {
        gameState.money -= upgrade.cost;
        updateUpgradeIndicators();
        updateUI();
        closeUpgradeModal();
        showNotification(`${friend.type.toUpperCase()} upgraded with ${upgrade.name}!`);
    }
}

function closeUpgradeModal() {
    const upgradeModal = document.getElementById('upgradeModal');
    if (upgradeModal) upgradeModal.style.display = 'none';
    gameState.selectedFriendForUpgrade = null;
}

function showCodex() {
    // Populate friends codex
    const friendsCodex = document.getElementById('friendsCodex');
    if (friendsCodex) {
        friendsCodex.innerHTML = '';

        for (let [type, data] of Object.entries(friendTypes)) {
            const div = document.createElement('div');
            div.className = 'codex-item';

            // Add effectiveness indicators
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

    // Populate enemies codex
    const enemiesCodex = document.getElementById('enemiesCodex');
    if (enemiesCodex) {
        enemiesCodex.innerHTML = '';

        for (let [type, data] of Object.entries(enemyTypes)) {
            const div = document.createElement('div');
            div.className = 'codex-item';

            // Find which friends are strong/weak against this enemy
            let counters = [];
            let struggles = [];

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
    if (codexModal) codexModal.style.display = 'flex';
}

function closeCodex() {
    const codexModal = document.getElementById('codexModal');
    if (codexModal) codexModal.style.display = 'none';
}

function updateUpgradeIndicators() {
    for (let friend of gameState.friends) {
        const btn = document.getElementById(friend.type + 'Btn');
        if (btn) {
            const indicator = btn.querySelector('.upgrade-indicator');
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

function updateUI() {
    // Fixed: Added null checks for all DOM elements
    const healthEl = document.getElementById('health');
    if (healthEl) {
        healthEl.textContent = Math.max(0, gameState.health);

        // Make health flash red when low
        if (gameState.health <= 5) {
            healthEl.classList.add('critical');
        } else {
            healthEl.classList.remove('critical');
        }
    }

    const moneyEl = document.getElementById('money');
    if (moneyEl) moneyEl.textContent = gameState.money;

    const waveEl = document.getElementById('wave');
    if (waveEl) waveEl.textContent = gameState.wave;

    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.textContent = gameState.score;

    // Update button states - disable if no money, game over, game not started, or no map selected
    Object.keys(friendTypes).forEach(type => {
        const btn = document.getElementById(type + 'Btn');
        if (btn) {
            btn.disabled = gameState.money < friendTypes[type].cost || gameState.gameOver || !gameState.gameStarted || !gameState.mapSelected;
        }
    });

    // Disable wave button if game over, not started, or no map selected
    const nextWaveBtn = document.getElementById('nextWaveBtn');
    if (nextWaveBtn) {
        nextWaveBtn.disabled = gameState.gameOver || !gameState.gameStarted || !gameState.mapSelected;
    }

    updateUpgradeIndicators();

    // Update wave status
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

                    gameState.wave++;
                    autoSave();

                    if (gameState.wave > 12) { // Assuming 12 waves per map
                        // Map completed! Unlock next map
                        const nextMapIndex = gameState.currentMap + 1;
                        if (nextMapIndex < maps.length && !gameState.unlockedMaps.includes(nextMapIndex)) {
                            gameState.unlockedMaps.push(nextMapIndex);
                            showNotification(`New map unlocked: ${maps[nextMapIndex].name}!`);
                        }
                    }

                    // Reset special abilities for next wave
                    resetWaveAbilities();

                    // Better reward system
                    let waveReward = 25 + gameState.wave * 3;
                    gameState.money += waveReward;

                    updateCodingProgress();
                    statusEl.textContent = `${waveConfig.name} survived! +${waveReward} Focus Points`;
                    updateUI();
                }, 1000);
                gameState.waveActive = false;
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

function gameLoop() {
    // Reset text state for everything in frame
    ctx.textBaseline = 'alphabetic';  // the canvas default
    ctx.textAlign = 'start';
    ctx.font = '12px Courier New';
    ctx.fillStyle = '#00ff41';

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
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

    // Always draw the path
    drawPath();

    // Update and draw game elements if game has started
    if (gameState.gameStarted) {
        // Update and draw friends
        gameState.friends.forEach(friend => {
            friend.update();
            friend.draw();
        });

        // Update and draw enemies
        gameState.enemies = gameState.enemies.filter(enemy => {
            enemy.update();
            enemy.draw();
            return enemy.alive;
        });

        // Update and draw projectiles
        gameState.projectiles = gameState.projectiles.filter(projectile => {
            projectile.update();
            projectile.draw();
            return projectile.alive;
        });

        // Update and draw banana particles
        gameState.bananas = gameState.bananas.filter(banana => {
            banana.update();
            banana.draw();
            return banana.life > 0;
        });

        // Update and draw trains (Ruel's special ability)
        gameState.trains = gameState.trains.filter(train => {
            train.update();
            train.draw();
            return train.isAlive();
        });

        // Update and draw speech bubbles
        gameState.speechBubbles = gameState.speechBubbles.filter(bubble => {
            bubble.update();
            bubble.draw();
            return bubble.life > 0;
        });
    }

    // Always show placement preview if friend selected
    if (gameState.selectedFriend && !gameState.gameOver) {
        const mouseX = gameState.mouseX;
        const mouseY = gameState.mouseY;

        // Check if placement is valid
        const isValid = !isOnPath(mouseX, mouseY) && !isOnFriend(mouseX, mouseY);

        // Preview tower body - enhanced visibility
        ctx.fillStyle = isValid ? 'rgba(0, 255, 65, 0.8)' : 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(mouseX - 15, mouseY - 15, 30, 30);

        // Border for the preview
        ctx.strokeStyle = isValid ? '#00ff41' : '#ff4757';
        ctx.lineWidth = 3;
        ctx.strokeRect(mouseX - 15, mouseY - 15, 30, 30);

        // Preview tower name
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(gameState.selectedFriend.toUpperCase(), mouseX, mouseY + 3);

        // Range preview circle
        ctx.strokeStyle = isValid ? 'rgba(0, 255, 65, 0.6)' : 'rgba(255, 0, 0, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, friendTypes[gameState.selectedFriend].range, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
    }

    // Refresh UI each frame so wave‐end logic in updateUI runs immediately
    updateUI();

    // Continue the game loop
    requestAnimationFrame(gameLoop);
}

// Event listeners
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log(`Canvas clicked at ${x}, ${y}`);

    if (!gameState.gameOver && gameState.gameStarted) {
        // Check for special abilities first
        let specialUsed = false;

        // Check for Dario family photo
        for (let friend of gameState.friends) {
            if (friend.type === 'dario' && !gameState.darioPhotoUsed) {
                const distance = Math.sqrt((friend.x - x) ** 2 + (friend.y - y) ** 2);
                if (distance < 25) {
                    // Trigger family photo!
                    gameState.darioPhotoUsed = true;
                    familyPhoto();
                    specialUsed = true;
                    break;
                }
            }
        }

        // Check for Ruel train rampage
        if (!specialUsed) {
            for (let friend of gameState.friends) {
                if (friend.type === 'ruel' && !gameState.trainRampageUsed) {
                    const distance = Math.sqrt((friend.x - x) ** 2 + (friend.y - y) ** 2);
                    if (distance < 25) {
                        // Trigger train rampage!
                        gameState.trainRampageUsed = true;
                        trainRampage(friend);
                        specialUsed = true;
                        break;
                    }
                }
            }
        }

        // Check for Tony move
        if (!specialUsed) {
            for (let friend of gameState.friends) {
                if (friend.type === 'tony' && !gameState.tonyMoveUsed) {
                    const distance = Math.sqrt((friend.x - x) ** 2 + (friend.y - y) ** 2);
                    if (distance < 25) {
                        // Start Tony move
                        gameState.movingTony = friend;
                        addSpeechBubble(friend.x, friend.y - 30, "Hey I'm coming to visit!");
                        showNotification("Click where Tony should move to!");
                        specialUsed = true;
                        break;
                    }
                }
            }
        }

        // Handle Tony placement
        if (!specialUsed && gameState.movingTony) {
            if (!isOnPath(x, y) && !isOnFriend(x, y)) {
                gameState.movingTony.x = x;
                gameState.movingTony.y = y;
                gameState.tonyMoveUsed = true;
                addSpeechBubble(x, y - 30, "Tony relocated!");
                gameState.movingTony = null;
                specialUsed = true;
            } else {
                showNotification("Can't move Tony there!");
            }
        }

        // Regular friend placement
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

        // Find friend to upgrade
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
    gameState.mouseX = e.clientX - rect.left;
    gameState.mouseY = e.clientY - rect.top;
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (gameState.selectedFriend) {
            cancelSelection();
        }
        if (document.getElementById('upgradeModal')?.style.display === 'flex') {
            closeUpgradeModal();
        }
        if (document.getElementById('codexModal')?.style.display === 'flex') {
            closeCodex();
        }
    }
});

// Make functions globally accessible
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

// Add these to your global function assignments
window.deleteSaveSlot = deleteSaveSlot;
window.confirmDelete = confirmDelete;
window.cancelDelete = cancelDelete;
window.showExitConfirm = showExitConfirm;
window.confirmExit = confirmExit;
window.cancelExit = cancelExit;
window.backToSaveSlots = backToSaveSlots;

// Fixed: Initialize properly when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');

    // Verify canvas is working
    if (ctx) {
        console.log('Canvas context initialized successfully');
        ctx.fillStyle = '#00ff41';
        ctx.fillRect(0, 0, 50, 50);
        console.log('Drew test rectangle');
    } else {
        console.error('Failed to get canvas context');
    }

    // FORCE storyline modal to show first - hide everything else
    showStorylineOnly();

    updateUI(); // Set initial UI state
    gameLoop(); // Start the visual loop right away
});

function resetWaveAbilities() {
    // Reset special abilities for each wave
    gameState.darioPhotoUsed = false;
    gameState.tonyMoveUsed = false;
    gameState.movingTony = null;
    gameState.trainRampageUsed = false;
    console.log('Wave abilities reset!');
};
// Save current game state
function saveGame(slotName = 'quicksave') {
    const saveData = {
        // Core game state
        health: gameState.health,
        money: gameState.money,
        wave: gameState.wave,
        score: gameState.score,
        currentMap: gameState.currentMap,
        totalEnemiesDefeated: gameState.totalEnemiesDefeated,
        codingProgress: gameState.codingProgress,
        unlockedMaps: gameState.unlockedMaps, // ADD this line

        // Friends data (position, type, upgrades)
        friends: gameState.friends.map(friend => ({
            x: friend.x,
            y: friend.y,
            type: friend.type,
            upgrades: friend.upgrades,
            // Special properties for specific friends
            experienceLevel: friend.experienceLevel || 0
        })),

        // Wave abilities state
        darioPhotoUsed: gameState.darioPhotoUsed,
        tonyMoveUsed: gameState.tonyMoveUsed,
        trainRampageUsed: gameState.trainRampageUsed,

        // Game flags
        gameStarted: gameState.gameStarted,
        mapSelected: gameState.mapSelected,
        waveActive: gameState.waveActive,

        // Timestamp
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

// Load game state
function loadGame(slotName = 'quicksave') {
    try {
        const saveDataStr = localStorage.getItem(`benDefense_${slotName}`);
        if (!saveDataStr) {
            showNotification(`No save found: ${slotName}`);
            return false;
        }

        const saveData = JSON.parse(saveDataStr);

        // Restore core game state
        gameState.health = saveData.health;
        gameState.money = saveData.money;
        gameState.wave = saveData.wave;
        gameState.score = saveData.score;
        gameState.currentMap = saveData.currentMap;
        gameState.totalEnemiesDefeated = saveData.totalEnemiesDefeated || 0;
        gameState.codingProgress = saveData.codingProgress || 0;
        gameState.unlockedMaps = saveData.unlockedMaps || [0]; // ADD this line

        // Restore game flags
        gameState.gameStarted = saveData.gameStarted;
        gameState.mapSelected = saveData.mapSelected;
        gameState.waveActive = saveData.waveActive || false;

        // Restore wave abilities
        gameState.darioPhotoUsed = saveData.darioPhotoUsed || false;
        gameState.tonyMoveUsed = saveData.tonyMoveUsed || false;
        gameState.trainRampageUsed = saveData.trainRampageUsed || false;

        // Clear current game objects
        gameState.friends = [];
        gameState.enemies = [];
        gameState.projectiles = [];
        gameState.trains = [];
        gameState.speechBubbles = [];
        gameState.bananas = [];

        // Restore friends
        if (saveData.friends) { // ADD null check
            saveData.friends.forEach(friendData => {
                const friend = new Friend(friendData.x, friendData.y, friendData.type);

                // Restore upgrades
                if (friendData.upgrades) {
                    friendData.upgrades.forEach(upgradeType => {
                        friend.upgrade(upgradeType);
                    });
                }

                // Restore special properties
                if (friendData.experienceLevel) {
                    friend.experienceLevel = friendData.experienceLevel;
                }

                gameState.friends.push(friend);
            });
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

function getSaveData(slotName) {
    try {
        const saveDataStr = localStorage.getItem(`benDefense_${slotName}`);
        return saveDataStr ? JSON.parse(saveDataStr) : null;
    } catch (error) {
        console.error('Failed to parse save data:', error);
        return null;
    }
}

function startNewGameInSlot(slotName) {
    currentSaveSlot = slotName;

    // Hide start modal
    const startModal = document.getElementById('startGameModal');
    if (startModal) startModal.style.display = 'none';

    // Reset game state
    resetGameState();

    // Show map selection
    showMapSelection();
}

function loadSlotAndSelectMap(slotName, saveData) {
    currentSaveSlot = slotName;

    // Load the save data using existing loadGame function
    if (loadGame(slotName)) {
        // Hide start modal
        const startModal = document.getElementById('startGameModal');
        if (startModal) startModal.style.display = 'none';

        // Show map selection with current progress
        showMapSelection();
    } else {
        // If load failed, show error and stay on save slots
        showNotification('Failed to load save game!');
    }
}

function startNewGame() {
    const startModal = document.getElementById('startGameModal');
    if (startModal) startModal.style.display = 'none';

    // Reset game state for new game
    resetGameState();

    // Show map selection
    showMapSelection();
}

function resetGameState() {
    // Reset to initial game state
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
    gameState.unlockedMaps = [0]; // ADD this line
}

function showStorylineOnly() {
    console.log('Showing storyline modal only');

    // Hide ALL modals first
    document.querySelectorAll('.modal, .storyline-modal').forEach(modal => {
        modal.style.display = 'none';
    });

    // Show ONLY the storyline modal
    const storylineModal = document.getElementById('storylineModal');
    if (storylineModal) {
        storylineModal.style.display = 'flex';
        console.log('Storyline modal is now visible');
    }

    // Dim and disable the game UI completely
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        gameContainer.style.opacity = '0.3';
        gameContainer.style.pointerEvents = 'none';
    }

    // Make sure game state is reset
    gameState.gameStarted = false;
    gameState.mapSelected = false;
    gameState.gameOver = false;
}

function deleteSaveSlot(slotName, event) {
    event.stopPropagation(); // Prevent slot selection

    const saveData = getSaveData(slotName);
    if (!saveData) return;

    currentSlotToDelete = slotName;

    const deleteModal = document.getElementById('deleteConfirmModal');
    const deleteText = document.getElementById('deleteConfirmText');

    const mapName = maps[saveData.currentMap]?.name || 'Unknown Map';
    deleteText.innerHTML = `
        Are you sure you want to delete this save?<br><br>
        <strong>Wave ${saveData.wave}</strong> • ${mapName}<br>
        <small>This action cannot be undone.</small>
    `;

    deleteModal.style.display = 'flex';
}

function confirmDelete() {
    if (currentSlotToDelete) {
        localStorage.removeItem(`benDefense_${currentSlotToDelete}`);
        showNotification(`Save slot deleted!`);
        currentSlotToDelete = null;

        // Close delete modal and refresh save slots
        document.getElementById('deleteConfirmModal').style.display = 'none';
        showStartGameOptions();
    }
}

function cancelDelete() {
    currentSlotToDelete = null;
    document.getElementById('deleteConfirmModal').style.display = 'none';
}

function showExitConfirm() {
    const exitModal = document.getElementById('exitConfirmModal');
    if (exitModal) {
        exitModal.style.display = 'flex';
        console.log('Exit modal should now be visible');
    } else {
        console.error('Exit modal not found!');
    }
}

function confirmExit() {
    // Auto-save current progress
    if (currentSaveSlot) {
        autoSaveToSlot();
    }

    // Close all modals
    closeAllModals();

    // Reset game state and show map selection
    showMapSelection();

    showNotification('Progress saved!');
}

function cancelExit() {
    document.getElementById('exitConfirmModal').style.display = 'none';
}

function autoSaveToSlot() {
    if (currentSaveSlot) {
        const saveData = {
            health: gameState.health,
            money: gameState.money,
            wave: gameState.wave,
            score: gameState.score,
            currentMap: gameState.currentMap,
            totalEnemiesDefeated: gameState.totalEnemiesDefeated,
            codingProgress: gameState.codingProgress,
            unlockedMaps: gameState.unlockedMaps, // ADD this missing property
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
        console.log('Auto-saved to slot:', currentSaveSlot); // ADD for debugging
    } else {
        console.log('No currentSaveSlot set - cannot auto-save'); // ADD for debugging
    }
}

function backToSaveSlots() {
    // Close map selection modal
    const mapModal = document.getElementById('mapSelectionModal');
    if (mapModal) mapModal.style.display = 'none';

    // Clear current slot selection
    currentSaveSlot = null;

    // Reset game state to clean slate
    resetGameState();

    // Show save slots again
    showStartGameOptions();
}

function showStartGameOptions() {
    const startModal = document.getElementById('startGameModal');
    const slotGrid = document.getElementById('saveSlotGrid');

    // Generate 3 save slots
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
            // Slot has save data
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
                <button onclick="deleteSaveSlot('${slotName}', event)" 
                        style="position: absolute; top: 10px; right: 10px; background: #ff4757; border: none; 
                               border-radius: 5px; color: white; padding: 5px 8px; cursor: pointer; font-size: 12px;">
                    🗑️
                </button>
            `;

            slotDiv.addEventListener('click', () => loadSlotAndSelectMap(slotName, saveData));
        } else {
            // Empty slot
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

        // Hover effects
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

    startModal.style.display = 'flex';
}

function closeAllModals() {
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
            modal.style.display = 'none';
        }
    });

    // Don't close storyline modals (startGameModal, mapSelectionModal, storylineModal)
}
function autoSave() {
    if (currentSaveSlot && gameState.gameStarted && !gameState.gameOver) {
        autoSaveToSlot();
    }
}
