// Click Climb - Game Logic

// ==================== CONSTANTS ====================
const COOLDOWN_HOURS = 23;
const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;
const MAX_LEVEL = 200;
const STREAK_BONUS_DAYS = 5;

// Detect if running on GitHub Pages (production)
const IS_PRODUCTION = window.location.hostname.includes('github.io');

// ==================== THEME CONFIG ====================
const THEMES = {
    plain: {
        name: 'Plain',
        title: 'Click Climb',
        tagline: 'One click a day. Reach Level 200.',
        levelLabel: 'Level',
        buttonText: 'CLICK',
        readyText: 'Ready to click!',
        nextText: 'Next click in',
        victoryText: '🎉 You reached the top!',
        historyLabel: 'Recent History',
        historyTitle: 'Recent Clicks',
        goalText: 'Climb from Level 1 to Level 200!',
        actionText: 'Click the button once every 23 hours. Each click has a random chance of success based on your level.',
        winText: 'Success at Level 199 = You win! 🎉',
        progressTop: '🏆',
        progressBottom: '📍',
        achieveIcon: '🏆',
        successIcon: '🎉',
        masterIcon: '👑',
        failIcon: '😔',
        successTitle: 'Success!',
        masterTitle: 'CHAMPION!',
        failTitle: 'Failed',
        successMsg: (lvl) => `You climbed to Level ${lvl}!`,
        masterMsg: 'You reached Level 200! You are a true champion!',
        failMsg: (lvl) => `You stay at Level ${lvl}. Try again tomorrow!`,
        chanceLabel: 'Probability was'
    },
    ninja: {
        name: 'Ninja',
        title: 'Click Climb',
        tagline: 'One strike per day. Ascend to mastery.',
        levelLabel: 'Rank',
        buttonText: 'STRIKE',
        readyText: 'Ready to strike!',
        nextText: 'Next strike in',
        victoryText: '⚔️ You have achieved mastery!',
        historyLabel: 'Battle History',
        historyTitle: 'Recent Battles',
        goalText: 'Ascend from Rank 1 to Rank 200!',
        actionText: 'Strike once every 23 hours. Each strike has a random chance of success based on your rank.',
        winText: 'Victory at Rank 199 = True mastery! ⚔️',
        progressTop: '⛩️',
        progressBottom: '🥷',
        achieveIcon: '⚔️',
        successIcon: '🗡️',
        masterIcon: '⚔️',
        failIcon: '💀',
        successTitle: 'Victory!',
        masterTitle: 'MASTER!',
        failTitle: 'Defeated',
        successMsg: (lvl) => `You advanced to Rank ${lvl}!`,
        masterMsg: 'You have reached Rank 200! A true Shadow Warrior!',
        failMsg: (lvl) => `You remain at Rank ${lvl}. Return tomorrow.`,
        chanceLabel: 'Strike chance was'
    },
    hiking: {
        name: 'Hiking',
        title: 'Click Climb',
        tagline: 'One step a day. Reach the summit.',
        levelLabel: 'Height',
        buttonText: 'CLIMB',
        readyText: 'Ready to climb!',
        nextText: 'Next climb in',
        victoryText: '🏔️ You reached the summit!',
        historyLabel: 'Trail Log',
        historyTitle: 'Recent Climbs',
        goalText: 'Climb from Height 1 to Height 200!',
        actionText: 'Take one step every 23 hours. Each step has a random chance of success based on your altitude.',
        winText: 'Success at Height 199 = Summit reached! 🏔️',
        progressTop: '🏔️',
        progressBottom: '🥾',
        achieveIcon: '🎒',
        successIcon: '⛰️',
        masterIcon: '🏔️',
        failIcon: '😓',
        successTitle: 'Progress!',
        masterTitle: 'SUMMIT!',
        failTitle: 'Slipped',
        successMsg: (lvl) => `You climbed to Height ${lvl}!`,
        masterMsg: 'You reached Height 200! The summit is yours!',
        failMsg: (lvl) => `You stay at Height ${lvl}. Rest and try tomorrow!`,
        chanceLabel: 'Success chance was'
    },
    gamble: {
        name: 'Gamble',
        title: 'Click Climb',
        tagline: 'One bet a day. Hit the jackpot.',
        levelLabel: 'Stake',
        buttonText: 'BET',
        readyText: 'Ready to bet!',
        nextText: 'Next bet in',
        victoryText: '💰 JACKPOT! You won it all!',
        historyLabel: 'Bet History',
        historyTitle: 'Recent Bets',
        goalText: 'Raise your Stake from 1 to 200!',
        actionText: 'Place one bet every 23 hours. Each bet has a random chance of winning based on your stake.',
        winText: 'Win at Stake 199 = JACKPOT! 💰',
        progressTop: '💎',
        progressBottom: '🎰',
        achieveIcon: '🎲',
        successIcon: '💵',
        masterIcon: '💰',
        failIcon: '😤',
        successTitle: 'Winner!',
        masterTitle: 'JACKPOT!',
        failTitle: 'Bust',
        successMsg: (lvl) => `You raised to Stake ${lvl}!`,
        masterMsg: 'You hit Stake 200! The house is yours!',
        failMsg: (lvl) => `You stay at Stake ${lvl}. Try your luck tomorrow!`,
        chanceLabel: 'Win odds were'
    }
};

let currentTheme = 'ninja';

// ==================== ACHIEVEMENTS ====================
const ACHIEVEMENTS = [
    { id: 'first_step', name: 'First Step', desc: 'Reach Level 2', icon: '👶', check: (s) => s.level >= 2 },
    { id: 'getting_started', name: 'Getting Started', desc: 'Reach Level 10', icon: '🚶', check: (s) => s.level >= 10 },
    { id: 'quarter_way', name: 'Quarter Way', desc: 'Reach Level 50', icon: '🏃', check: (s) => s.level >= 50 },
    { id: 'halfway', name: 'Halfway There', desc: 'Reach Level 100', icon: '⛰️', check: (s) => s.level >= 100 },
    { id: 'the_grind', name: 'The Grind', desc: 'Reach Level 150', icon: '🧗', check: (s) => s.level >= 150 },
    { id: 'so_close', name: 'So Close', desc: 'Reach Level 199', icon: '😰', check: (s) => s.level >= 199 },
    { id: 'champion', name: 'Champion', desc: 'Reach Level 200', icon: '👑', check: (s) => s.level >= 200 },
    { id: 'lucky_streak', name: 'Lucky Streak', desc: 'Win 5 times in a row', icon: '🍀', check: (s) => s.winStreak >= 5 },
    { id: 'unlucky', name: 'Unlucky Day', desc: 'Fail 5 times in a row', icon: '😢', check: (s) => s.loseStreak >= 5 },
    { id: 'persistent', name: 'Persistent', desc: 'Play 7 consecutive days', icon: '📅', check: (s) => s.consecutiveDays >= 7 },
    { id: 'dedicated', name: 'Dedicated', desc: 'Play 30 consecutive days', icon: '🔥', check: (s) => s.consecutiveDays >= 30 },
    { id: 'veteran', name: 'Veteran', desc: 'Play 100 total days', icon: '🎖️', check: (s) => s.totalDays >= 100 },
    { id: 'against_odds', name: 'Against All Odds', desc: 'Win at 1% probability', icon: '🎲', check: (s) => s.wonAt1Percent },
    { id: 'heartbreak', name: 'Heartbreak', desc: 'Fail at 99%+ probability', icon: '💔', check: (s) => s.failedAt99Percent },
    { id: 'bonus_master', name: 'Bonus Master', desc: 'Use 5 bonus clicks', icon: '⭐', check: (s) => s.bonusClicksUsed >= 5 }
];

// ==================== GAME STATE ====================
let gameState = {
    level: 1,
    lastClickTime: null,
    totalClicks: 0,
    totalSuccesses: 0,
    consecutiveDays: 0,
    lastPlayDate: null,
    bonusClicks: 0,
    bonusClicksUsed: 0,
    achievements: [],
    history: [],
    winStreak: 0,
    loseStreak: 0,
    totalDays: 0,
    wonAt1Percent: false,
    failedAt99Percent: false
};

// ==================== INITIALIZATION ====================
function init() {
    loadGameState();
    loadTheme();
    updateUI();
    startCooldownTimer();
    renderAchievements();
    renderHistory();
    checkDayStreak();
    
    // Hide dev tools in production (GitHub Pages)
    if (IS_PRODUCTION) {
        const devButton = document.querySelector('button[onclick="toggleDevTools()"]');
        if (devButton) devButton.style.display = 'none';
    }
}

// ==================== THEME FUNCTIONS ====================
function setTheme(themeName) {
    if (!THEMES[themeName]) return;
    
    currentTheme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('clickClimbTheme', themeName);
    
    // Update active button
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === themeName);
    });
    
    // Apply theme text
    applyThemeText();
    updateCooldownDisplay();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('clickClimbTheme') || 'ninja';
    setTheme(savedTheme);
}

function applyThemeText() {
    const t = THEMES[currentTheme];
    
    // Header
    document.getElementById('gameTitle').textContent = t.title;
    document.getElementById('gameTagline').textContent = t.tagline;
    
    // Level display
    document.getElementById('levelLabel').textContent = t.levelLabel;
    document.getElementById('progressTop').textContent = t.progressTop;
    document.getElementById('progressBottom').textContent = t.progressBottom;
    
    // Button
    document.getElementById('buttonText').textContent = t.buttonText;
    
    // Panels
    document.getElementById('achieveIcon').textContent = t.achieveIcon;
    document.getElementById('historyLabel').textContent = t.historyLabel;
    document.getElementById('historyTitle').textContent = t.historyTitle;
    
    // How to play
    document.getElementById('goalText').textContent = t.goalText;
    document.getElementById('actionText').textContent = t.actionText;
    document.getElementById('winText').textContent = t.winText;
}

// ==================== STORAGE ====================
function saveGameState() {
    localStorage.setItem('clickClimb', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('clickClimb');
    if (saved) {
        gameState = { ...gameState, ...JSON.parse(saved) };
    }
}

// ==================== PROBABILITY LOGIC ====================
function calculateProbability(level) {
    // Level 1: [100]
    // Level 2: [100, 99]
    // Level 100: [100, 99, ..., 1]
    // Level 101: [99, 98, ..., 1]
    // Level 199: [1] - Final level, success = WIN!
    
    let maxProb, minProb;
    
    if (level <= 100) {
        maxProb = 100;
        minProb = 100 - level + 1;
    } else {
        // Level 101+: max decreases
        maxProb = 100 - (level - 100);
        minProb = 1;
    }
    
    // Ensure valid range
    maxProb = Math.max(1, Math.min(100, maxProb));
    minProb = Math.max(1, Math.min(maxProb, minProb));
    
    // Random probability within range
    const range = maxProb - minProb + 1;
    const probability = minProb + Math.floor(Math.random() * range);
    
    return probability;
}

function rollSuccess(probability) {
    const roll = Math.random() * 100;
    return roll < probability;
}

// ==================== GAME ACTIONS ====================
function handleClick() {
    if (!canClick()) return;
    
    performClick(false);
}

function useBonusClick() {
    if (gameState.bonusClicks <= 0) return;
    
    gameState.bonusClicks--;
    gameState.bonusClicksUsed++;
    performClick(true);
}

function performClick(isBonus) {
    const probability = calculateProbability(gameState.level);
    const success = rollSuccess(probability);
    
    // Update stats
    gameState.totalClicks++;
    if (!isBonus) {
        gameState.lastClickTime = Date.now();
    }
    
    // Track streaks
    if (success) {
        gameState.totalSuccesses++;
        gameState.winStreak++;
        gameState.loseStreak = 0;
        gameState.level++;
        
        // Track special achievements
        if (probability === 1) {
            gameState.wonAt1Percent = true;
        }
    } else {
        gameState.loseStreak++;
        gameState.winStreak = 0;
        
        // Track special achievements
        if (probability >= 99) {
            gameState.failedAt99Percent = true;
        }
    }
    
    // Add to history
    gameState.history.unshift({
        date: new Date().toISOString(),
        level: success ? gameState.level - 1 : gameState.level,
        probability: probability,
        success: success,
        isBonus: isBonus
    });
    
    // Keep only last 50 entries
    if (gameState.history.length > 50) {
        gameState.history = gameState.history.slice(0, 50);
    }
    
    // Update day tracking
    updateDayTracking();
    
    // Check achievements
    const newAchievements = checkAchievements();
    
    // Save and update UI
    saveGameState();
    updateUI();
    renderHistory();
    
    // Show result modal
    showResultModal(success, probability, gameState.level, newAchievements);
}

function canClick() {
    if (!gameState.lastClickTime) return true;
    
    const elapsed = Date.now() - gameState.lastClickTime;
    return elapsed >= COOLDOWN_MS;
}

function getRemainingCooldown() {
    if (!gameState.lastClickTime) return 0;
    
    const elapsed = Date.now() - gameState.lastClickTime;
    const remaining = COOLDOWN_MS - elapsed;
    
    return Math.max(0, remaining);
}

// ==================== DAY TRACKING ====================
function updateDayTracking() {
    const today = new Date().toDateString();
    
    if (gameState.lastPlayDate !== today) {
        gameState.totalDays++;
        gameState.lastPlayDate = today;
    }
}

function checkDayStreak() {
    if (!gameState.lastPlayDate) return;
    
    const lastPlay = new Date(gameState.lastPlayDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if last play was yesterday (streak continues)
    if (lastPlay.toDateString() === yesterday.toDateString()) {
        // Streak is still valid, will be incremented on next click
    } else if (lastPlay.toDateString() !== today.toDateString()) {
        // Streak broken (more than 1 day gap)
        gameState.consecutiveDays = 0;
        saveGameState();
    }
    
    // Award bonus clicks for streak
    checkStreakBonus();
}

function checkStreakBonus() {
    const today = new Date().toDateString();
    
    if (gameState.lastPlayDate === today) {
        // Already played today
        return;
    }
    
    // Check if this would be a streak day
    if (gameState.lastPlayDate) {
        const lastPlay = new Date(gameState.lastPlayDate);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastPlay.toDateString() === yesterday.toDateString()) {
            // Continuing streak
            const newStreak = gameState.consecutiveDays + 1;
            
            // Award bonus click every 5 days
            if (newStreak > 0 && newStreak % STREAK_BONUS_DAYS === 0) {
                gameState.bonusClicks++;
                showToast(`🎁 ${STREAK_BONUS_DAYS}-day streak! +1 Bonus Click`);
            }
            
            gameState.consecutiveDays = newStreak;
        } else if (lastPlay.toDateString() !== today) {
            // Streak broken
            gameState.consecutiveDays = 1;
        }
    } else {
        gameState.consecutiveDays = 1;
    }
}

// ==================== ACHIEVEMENTS ====================
function checkAchievements() {
    const newlyUnlocked = [];
    
    ACHIEVEMENTS.forEach(achievement => {
        if (!gameState.achievements.includes(achievement.id)) {
            if (achievement.check(gameState)) {
                gameState.achievements.push(achievement.id);
                newlyUnlocked.push(achievement);
            }
        }
    });
    
    if (newlyUnlocked.length > 0) {
        renderAchievements();
    }
    
    return newlyUnlocked;
}

function renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    const count = document.getElementById('achievementCount');
    
    grid.innerHTML = ACHIEVEMENTS.map(a => {
        const unlocked = gameState.achievements.includes(a.id);
        return `
            <div class="achievement ${unlocked ? 'unlocked' : ''}" title="${a.desc}">
                <div class="achievement-icon">${a.icon}</div>
                <div class="achievement-name">${a.name}</div>
            </div>
        `;
    }).join('');
    
    count.textContent = `(${gameState.achievements.length}/${ACHIEVEMENTS.length})`;
}

// ==================== UI UPDATES ====================
function updateUI() {
    // Level
    document.getElementById('currentLevel').textContent = gameState.level;
    
    // Progress bar (vertical - uses height)
    const progress = (gameState.level / MAX_LEVEL) * 100;
    document.getElementById('progressFill').style.height = `${progress}%`;
    document.getElementById('progressText').textContent = `${gameState.level} / ${MAX_LEVEL}`;
    
    // Stats
    document.getElementById('streakDays').textContent = gameState.consecutiveDays;
    document.getElementById('bonusClicks').textContent = gameState.bonusClicks;
    document.getElementById('totalClicks').textContent = gameState.totalClicks;
    
    // Button state
    const button = document.getElementById('climbButton');
    const canClickNow = canClick();
    button.disabled = !canClickNow || gameState.level >= MAX_LEVEL;
    
    // Bonus button
    const bonusBtn = document.getElementById('bonusButton');
    bonusBtn.style.display = gameState.bonusClicks > 0 && gameState.level < MAX_LEVEL ? 'block' : 'none';
    
    // Victory state
    if (gameState.level >= MAX_LEVEL) {
        document.getElementById('currentLevel').classList.add('victory');
        document.getElementById('cooldownText').textContent = THEMES[currentTheme].victoryText;
        document.getElementById('cooldownText').classList.add('ready');
    }
    
    // Update cooldown display
    updateCooldownDisplay();
}

function updateCooldownDisplay() {
    const cooldownText = document.getElementById('cooldownText');
    const remaining = getRemainingCooldown();
    const t = THEMES[currentTheme];
    
    if (gameState.level >= MAX_LEVEL) {
        cooldownText.textContent = t.victoryText;
        cooldownText.classList.add('ready');
        return;
    }
    
    if (remaining <= 0) {
        cooldownText.textContent = t.readyText;
        cooldownText.classList.add('ready');
    } else {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        cooldownText.textContent = `${t.nextText} ${hours}h ${minutes}m ${seconds}s`;
        cooldownText.classList.remove('ready');
    }
}

function startCooldownTimer() {
    setInterval(() => {
        updateCooldownDisplay();
        
        // Re-enable button when cooldown ends
        const button = document.getElementById('climbButton');
        if (canClick() && gameState.level < MAX_LEVEL) {
            button.disabled = false;
        }
    }, 1000);
}

// ==================== HISTORY ====================
function renderHistory() {
    const list = document.getElementById('historyList');
    
    if (gameState.history.length === 0) {
        list.innerHTML = '<p style="color: var(--text-light); text-align: center;">No clicks yet</p>';
        return;
    }
    
    list.innerHTML = gameState.history.slice(0, 10).map(h => {
        const dateObj = new Date(h.date);
        const date = dateObj.toLocaleDateString();
        const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const bonus = h.isBonus ? ' ⭐' : '';
        return `
            <div class="history-item ${h.success ? 'success' : 'fail'}">
                <span class="history-info">
                    <span class="history-level">Lvl ${h.level} → ${h.probability}%${bonus}</span>
                    <span class="history-time">${date} ${time}</span>
                </span>
                <span>${h.success ? '✓ Success' : '✗ Failed'}</span>
            </div>
        `;
    }).join('');
}

// ==================== MODALS & TOASTS ====================
function showResultModal(success, probability, newLevel, newAchievements) {
    const modal = document.getElementById('resultModal');
    const icon = document.getElementById('modalIcon');
    const title = document.getElementById('modalTitle');
    const message = document.getElementById('modalMessage');
    const stats = document.getElementById('modalStats');
    const t = THEMES[currentTheme];
    
    if (success) {
        icon.textContent = newLevel >= MAX_LEVEL ? t.masterIcon : t.successIcon;
        title.textContent = newLevel >= MAX_LEVEL ? t.masterTitle : t.successTitle;
        message.textContent = newLevel >= MAX_LEVEL ? t.masterMsg : t.successMsg(newLevel);
    } else {
        icon.textContent = t.failIcon;
        title.textContent = t.failTitle;
        message.textContent = t.failMsg(newLevel);
    }
    
    stats.innerHTML = `
        <div>${t.chanceLabel}: <strong>${probability}%</strong></div>
        ${newAchievements.length > 0 ? `<div style="margin-top: 10px; color: var(--warning);">${t.achieveIcon} New: ${newAchievements.map(a => a.name).join(', ')}</div>` : ''}
    `;
    
    modal.classList.add('open');
}

function closeModal() {
    document.getElementById('resultModal').classList.remove('open');
}

function showToast(message) {
    const toast = document.getElementById('achievementToast');
    document.getElementById('toastText').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== PANELS ====================
function toggleAchievements() {
    document.getElementById('achievementsPanel').classList.toggle('open');
    document.getElementById('historyPanel').classList.remove('open');
    document.getElementById('howToPlayPanel').classList.remove('open');
    document.getElementById('aboutPanel').classList.remove('open');
}

function toggleHistory() {
    document.getElementById('historyPanel').classList.toggle('open');
    document.getElementById('achievementsPanel').classList.remove('open');
    document.getElementById('howToPlayPanel').classList.remove('open');
    document.getElementById('aboutPanel').classList.remove('open');
}

function toggleHowToPlay() {
    document.getElementById('howToPlayPanel').classList.toggle('open');
    document.getElementById('achievementsPanel').classList.remove('open');
    document.getElementById('historyPanel').classList.remove('open');
    document.getElementById('aboutPanel').classList.remove('open');
}

function toggleAbout() {
    document.getElementById('aboutPanel').classList.toggle('open');
    document.getElementById('achievementsPanel').classList.remove('open');
    document.getElementById('historyPanel').classList.remove('open');
    document.getElementById('howToPlayPanel').classList.remove('open');
}

function toggleDevTools() {
    document.getElementById('devPanel').classList.toggle('open');
}

// ==================== DEVELOPER TOOLS ====================
function devClearTimer() {
    gameState.lastClickTime = null;
    saveGameState();
    updateUI();
    showToast('⏱️ Timer cleared!');
}

function devSetLevel() {
    const input = document.getElementById('devLevelInput');
    const level = parseInt(input.value);
    
    if (level >= 1 && level <= 200) {
        gameState.level = level;
        saveGameState();
        updateUI();
        checkAchievements();
        renderAchievements();
        showToast(`📊 Level set to ${level}`);
    } else {
        showToast('❌ Level must be 1-200');
    }
}

function devSetLevelQuick(level) {
    gameState.level = level;
    saveGameState();
    updateUI();
    checkAchievements();
    renderAchievements();
    showToast(`📊 Level set to ${level}`);
}

function devAddBonus() {
    const input = document.getElementById('devBonusInput');
    const amount = parseInt(input.value) || 1;
    
    gameState.bonusClicks += amount;
    saveGameState();
    updateUI();
    showToast(`⭐ Added ${amount} bonus click(s)`);
}

function devSetStreak() {
    const input = document.getElementById('devStreakInput');
    const streak = parseInt(input.value) || 0;
    
    gameState.consecutiveDays = streak;
    saveGameState();
    updateUI();
    checkAchievements();
    renderAchievements();
    showToast(`🔥 Streak set to ${streak} days`);
}

function devUnlockAllAchievements() {
    gameState.achievements = ACHIEVEMENTS.map(a => a.id);
    saveGameState();
    renderAchievements();
    showToast('🏆 All achievements unlocked!');
}

function devClearAchievements() {
    gameState.achievements = [];
    saveGameState();
    renderAchievements();
    showToast('🗑️ Achievements cleared');
}

function devShowState() {
    console.log('=== Click Climb Game State ===');
    console.log(JSON.stringify(gameState, null, 2));
    showToast('📋 State logged to console (F12)');
}

// ==================== RESET ====================
function confirmReset() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
        localStorage.removeItem('clickClimb');
        location.reload();
    }
}

// ==================== START ====================
init();
