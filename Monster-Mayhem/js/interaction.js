/**
 * Interaction Handler
 * Manages user interactions and game events
 */

class Interaction {
    constructor() {
        this.initializeInteractions();
    }

    /**
     * Initialize all interactions
     */
    initializeInteractions() {
        this.setupKeyboardShortcuts();
        this.setupTouchSupport();
        this.setupAccessibility();
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Prevent default behavior for game keys
            if (['a', 'd', 'h'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }

            // Game controls
            const key = e.key.toLowerCase();
            if (key === '?') {
                this.showHelp();
            }
        });
    }

    /**
     * Setup touch support for mobile
     */
    setupTouchSupport() {
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Swipe detection
            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe right - defend
                } else {
                    // Swipe left - attack
                }
            }

            if (Math.abs(deltaY) > 50) {
                if (deltaY > 0) {
                    // Swipe down - scroll
                } else {
                    // Swipe up - heal
                }
            }
        });
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Add ARIA labels to buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach((btn) => {
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', btn.textContent);
            }
        });

        // Add focus visible styles
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }

    /**
     * Show help dialog
     */
    showHelp() {
        const helpText = `
        ⚔️ MONSTER MAYHEM - HELP ⚔️
        
        KEYBOARD CONTROLS:
        • A - Attack the selected monster
        • D - Defend against incoming damage
        • H - Heal yourself (costs experience)
        
        MOUSE CONTROLS:
        • Click a monster to select it
        • Click the action buttons
        
        GAME MECHANICS:
        • Defeat all monsters to complete a level
        • Each defeated monster gives experience
        • Accumulate experience to level up
        • Level up increases your power and health
        • The game gets harder after each level
        
        STATS:
        • Health: Your current health points
        • Level: Your player level
        • Power Level: Increases your attack damage
        • Armor: Reduces incoming damage
        • Experience: Needed to level up and heal
        
        TIPS:
        • Use Defend to reduce damage when health is low
        • Focus fire on one monster at a time
        • Balance offense and defense for survival
        • Healing is expensive, use it wisely!
        `;
        alert(helpText);
    }
}

/**
 * Game Statistics Tracker
 * Tracks and manages game statistics
 */
class StatisticsTracker {
    constructor() {
        this.stats = {
            gamesPlayed: 0,
            gamesWon: 0,
            totalScore: 0,
            highScore: 0,
            totalMonstersDefeated: 0,
            highestLevel: 0,
            playTime: 0
        };
        this.loadStats();
    }

    /**
     * Save statistics to localStorage
     */
    saveStats() {
        localStorage.setItem('monsterMayhemStats', JSON.stringify(this.stats));
    }

    /**
     * Load statistics from localStorage
     */
    loadStats() {
        const saved = localStorage.getItem('monsterMayhemStats');
        if (saved) {
            this.stats = JSON.parse(saved);
        }
    }

    /**
     * Update statistics after game
     */
    updateStats(playerStats, won) {
        this.stats.gamesPlayed++;
        if (won) {
            this.stats.gamesWon++;
        }
        this.stats.totalScore += playerStats.score;
        this.stats.highScore = Math.max(this.stats.highScore, playerStats.score);
        this.stats.totalMonstersDefeated += playerStats.monstersDefeated;
        this.stats.highestLevel = Math.max(this.stats.highestLevel, playerStats.level);

        this.saveStats();
    }

    /**
     * Get statistics summary
     */
    getStatsSummary() {
        return `
        📊 GAME STATISTICS
        
        Total Games Played: ${this.stats.gamesPlayed}
        Games Won: ${this.stats.gamesWon}
        Win Rate: ${this.stats.gamesPlayed > 0 ? ((this.stats.gamesWon / this.stats.gamesPlayed) * 100).toFixed(1) : 0}%
        
        Total Score: ${this.stats.totalScore}
        High Score: ${this.stats.highScore}
        Total Monsters Defeated: ${this.stats.totalMonstersDefeated}
        Highest Level Reached: ${this.stats.highestLevel}
        `;
    }

    /**
     * Reset all statistics
     */
    resetStats() {
        this.stats = {
            gamesPlayed: 0,
            gamesWon: 0,
            totalScore: 0,
            highScore: 0,
            totalMonstersDefeated: 0,
            highestLevel: 0,
            playTime: 0
        };
        this.saveStats();
    }
}

/**
 * Sound Effects Manager
 * Handles game sounds (with fallback if not available)
 */
class SoundManager {
    constructor() {
        this.soundEnabled = true;
        this.initializeSounds();
    }

    /**
     * Initialize sound effects
     */
    initializeSounds() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio not supported');
            this.soundEnabled = false;
        }
    }

    /**
     * Play attack sound
     */
    playAttackSound() {
        if (!this.soundEnabled) return;
        this.playTone(400, 100);
    }

    /**
     * Play defense sound
     */
    playDefenseSound() {
        if (!this.soundEnabled) return;
        this.playTone(600, 150);
    }

    /**
     * Play victory sound
     */
    playVictorySound() {
        if (!this.soundEnabled) return;
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(523.25, now); // C
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        osc.start(now);
        osc.stop(now + 0.5);
    }

    /**
     * Play damage sound
     */
    playDamageSound() {
        if (!this.soundEnabled) return;
        this.playTone(200, 200);
    }

    /**
     * Play general tone
     */
    playTone(frequency, duration) {
        if (!this.soundEnabled) return;
        
        try {
            const ctx = this.audioContext;
            const now = ctx.currentTime;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.value = frequency;
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);
            
            osc.start(now);
            osc.stop(now + duration / 1000);
        } catch (e) {
            console.log('Sound playback error:', e);
        }
    }

    /**
     * Toggle sound
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }
}

/**
 * Performance Monitor
 * Tracks game performance metrics
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            renderTime: 0,
            updateTime: 0
        };
        this.frameCount = 0;
        this.lastTime = performance.now();
    }

    /**
     * Update performance metrics
     */
    update() {
        this.frameCount++;
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;

        if (deltaTime >= 1000) {
            this.metrics.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
    }

    /**
     * Get performance metrics
     */
    getMetrics() {
        return this.metrics;
    }
}

// Initialize interaction handler
const interaction = new Interaction();

// Initialize statistics tracker
const statsTracker = new StatisticsTracker();

// Initialize sound manager
const soundManager = new SoundManager();

// Initialize performance monitor
const performanceMonitor = new PerformanceMonitor();

// Setup animation frame for performance monitoring
function animationLoop() {
    performanceMonitor.update();
    requestAnimationFrame(animationLoop);
}

animationLoop();

// Add some polish to button interactions
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousedown', () => {
        soundManager.playAttackSound();
    });
});

// Update stats when game ends (hook into game object)
const originalGameOverWin = Game.prototype.gameOverWin;
const originalGameOverLose = Game.prototype.gameOverLose;

Game.prototype.gameOverWin = function() {
    statsTracker.updateStats(this.player, true);
    soundManager.playVictorySound();
    originalGameOverWin.call(this);
};

Game.prototype.gameOverLose = function() {
    statsTracker.updateStats(this.player, false);
    soundManager.playDamageSound();
    originalGameOverLose.call(this);
};
