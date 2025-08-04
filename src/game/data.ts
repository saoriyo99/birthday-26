import { MapData, FriendStats, EnemyStats, WaveConfig, UpgradeOption } from './types';

// Maps
export const maps: MapData[] = [
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

// Friend types
export const friendTypes: { [key: string]: FriendStats } = {
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
        experienceLevel: 0,
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

// Enemy types
export const enemyTypes: { [key: string]: EnemyStats } = {
    neighbor: { health: 30, speed: 1, reward: 10, socialDamage: 1, color: '#FFE082', name: 'Chatty Neighbor', icon: '🏠', desc: 'Wants to talk about the weather and property values.', category: 'gullible' },
    clerk: { health: 25, speed: 1.2, reward: 8, socialDamage: 1, color: '#A5D6A7', name: 'Retail Clerk', icon: '🛍️', desc: 'Did you find everything you need today?', category: 'gullible' },
    uber: { health: 35, speed: 0.8, reward: 12, socialDamage: 1, color: '#90CAF9', name: 'Uber Driver', icon: '🚗', desc: 'Trapped audience who wants to share life philosophy.', category: 'gullible' },
    performer: { health: 40, speed: 1.8, reward: 18, socialDamage: 1.5, color: '#CE93D8', name: 'Street Performer', icon: '🎭', desc: 'High energy entertainer demanding audience participation.', category: 'energetic' },
    elderly: { health: 50, speed: 0.6, reward: 22, socialDamage: 1.5, color: '#BCAAA4', name: 'Elderly Storyteller', icon: '👴', desc: 'Has many stories from "back in my day".', category: 'patient' },
    gymguy: { health: 55, speed: 1.4, reward: 20, socialDamage: 1.5, color: '#FFAB91', name: 'Gym Regular', icon: '💪', desc: 'Wants to discuss your workout routine and protein intake.', category: 'energetic' },
    boss: { health: 80, speed: 0.9, reward: 28, socialDamage: 2.5, color: '#F48FB1', name: 'Boss', icon: '💼', desc: 'Needs to circle back and touch base about synergies.', category: 'professional' },
    evangelist: { health: 70, speed: 1.1, reward: 26, socialDamage: 2, color: '#FFF176', name: 'Evangelist', icon: '📖', desc: 'Very persistent about sharing good news.', category: 'persistent' },
    oversharer: { health: 60, speed: 1.2, reward: 22, socialDamage: 2, color: '#FFAB91', name: 'Oversharer', icon: '😭', desc: 'Dumps entire relationship history on strangers.', category: 'emotional' },
    networker: { health: 75, speed: 1.5, reward: 32, socialDamage: 3, color: '#80CBC4', name: 'Networking Enthusiast', icon: '🤝', desc: 'Wants to grab coffee and ideate some solutions.', category: 'professional' },
    bartender: { health: 85, speed: 0.7, reward: 30, socialDamage: 2.5, color: '#E6EE9C', name: 'Bartender', icon: '🍺', desc: 'Professional conversationalist with endless small talk.', category: 'patient' },
    coworker: { health: 65, speed: 1, reward: 25, socialDamage: 2, color: '#B39DDB', name: 'Bad Code Coworker', icon: '💻', desc: 'Submits terrible code and wants you to fix it.', category: 'nerdy' },
    intern: { health: 45, speed: 2, reward: 20, socialDamage: 2, color: '#FFCC80', name: 'Clueless Intern', icon: '🤷', desc: 'Asks endless questions and follows you around.', category: 'nerdy' },
    elevator: { health: 40, speed: 2.2, reward: 18, socialDamage: 1.5, color: '#D1C4E9', name: 'Elevator Person', icon: '🏢', desc: 'Awkward small talk in confined vertical space.', category: 'fast' },
    uberboss: { health: 200, speed: 0.5, reward: 80, socialDamage: 5, color: '#1565C0', name: 'Uber Driver Boss', icon: '🚙', desc: 'Ultimate captive audience nightmare with strong opinions.', category: 'boss' },
    karen: { health: 250, speed: 0.6, reward: 100, socialDamage: 7, color: '#AD1457', name: 'Karen Manager Meeting', icon: '👩‍💼', desc: 'Meeting that could have been an email but wants face time.', category: 'boss' },
    uncle: { health: 220, speed: 0.4, reward: 90, socialDamage: 6, color: '#5D4037', name: 'Family Reunion Uncle', icon: '👨‍🦳', desc: 'Strong political opinions and vacation slideshow ready.', category: 'boss' }
};

// Wave configurations
export const waveConfigs: WaveConfig[] = [
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
export const upgradeOptions: { [key: string]: UpgradeOption } = {
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
