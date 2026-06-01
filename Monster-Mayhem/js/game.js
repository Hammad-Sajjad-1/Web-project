/**
 * Game Engine
 * Core game logic, player management, and game state
 */

class Game {
    constructor() {
        this.player = {
            health: 100,
            maxHealth: 100,
            experience: 0,
            maxExperience: 100,
            level: 1,
            powerLevel: 1,
            armor: 10,
            score: 0,
            monstersDefeated: 0,
            defending: false,
            healingCost: 30
        };

        this.selectedMonster = null;
        this.gameOver = false;
        this.difficulty = 1;
        this.turnCount = 0;
        this.gameStarted = false;

        this.initializeUI();
        this.setupWelcomeScreen();
    }

    /**
     * Initialize UI elements
     */
    initializeUI() {
        this.elements = {
            playerHealth: document.getElementById('playerHealth'),
            healthText: document.getElementById('healthText'),
            score: document.getElementById('score'),
            level: document.getElementById('level'),
            monstersDefeated: document.getElementById('monstersDefeated'),
            experience: document.getElementById('experience'),
            expFill: document.getElementById('expFill'),
            powerLevel: document.getElementById('powerLevel'),
            armor: document.getElementById('armor'),
            monsterDisplay: document.getElementById('monsterDisplay'),
            messageLog: document.getElementById('messageLog'),
            attackBtn: document.getElementById('attackBtn'),
            defendBtn: document.getElementById('defendBtn'),
            healBtn: document.getElementById('healBtn'),
            newGameBtn: document.getElementById('newGameBtn'),
            welcomeOverlay: document.getElementById('welcomeOverlay'),
            gameContainer: document.getElementById('gameContainer'),
            startGameBtn: document.getElementById('startGameBtn')
        };
    }

    /**
     * Setup welcome screen
     */
    setupWelcomeScreen() {
        this.elements.startGameBtn.addEventListener('click', () => {
            this.startGame();
        });

        // Also allow Enter key to start
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.gameStarted && this.elements.welcomeOverlay.style.display !== 'none') {
                this.startGame();
            }
        });
    }

    /**
     * Start the game from welcome screen
     */
    startGame() {
        this.gameStarted = true;
        
        // Hide welcome screen
        this.elements.welcomeOverlay.style.display = 'none';
        
        // Show game container
        this.elements.gameContainer.style.display = 'block';

        // Initialize game
        this.initializeGame();
    }

    /**
     * Initialize the actual game
     */
    initializeGame() {
        this.setupEventListeners();
        this.startNewGame();
    }

    /**
     * Setup event listeners for buttons and controls
     */
    setupEventListeners() {
        this.elements.attackBtn.addEventListener('click', () => this.playerAttack());
        this.elements.defendBtn.addEventListener('click', () => this.playerDefend());
        this.elements.healBtn.addEventListener('click', () => this.playerHeal());
        this.elements.newGameBtn.addEventListener('click', () => this.resetToWelcome());

        document.addEventListener('keydown', (e) => {
            if (this.gameOver || !this.gameStarted) return;
            if (e.key.toLowerCase() === 'a') this.playerAttack();
            if (e.key.toLowerCase() === 'd') this.playerDefend();
            if (e.key.toLowerCase() === 'h') this.playerHeal();
        });
    }

    /**
     * Reset game and go back to welcome screen
     */
    resetToWelcome() {
        // Remove game over overlay if exists
        this.removeGameOverOverlay();
        
        this.gameStarted = false;
        this.gameOver = false;
        
        // Show welcome screen
        this.elements.welcomeOverlay.style.display = 'flex';
        
        // Hide game container
        this.elements.gameContainer.style.display = 'none';

        // Clear board
        board.clear();
        this.clearMessages();
        this.selectedMonster = null;
    }

    /**
     * Remove game over overlay
     */
    removeGameOverOverlay() {
        const overlay = document.querySelector('.game-over-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    /**
     * Start a new game
     */
    startNewGame() {
        // Remove game over overlay if exists
        this.removeGameOverOverlay();
        
        this.gameOver = false;
        this.player = {
            health: 100,
            maxHealth: 100,
            experience: 0,
            maxExperience: 100,
            level: 1,
            powerLevel: 1,
            armor: 10,
            score: 0,
            monstersDefeated: 0,
            defending: false,
            healingCost: 30
        };

        this.selectedMonster = null;
        this.difficulty = 1;
        this.turnCount = 0;

        board.initialize(this.difficulty);
        this.updateUI();
        this.clearMessages();
        this.addMessage('🎮 Game started! Select a monster and begin battling!');
        this.addMessage('⌨️ Keyboard: A=Attack, D=Defend, H=Heal');
    }

    /**
     * Select a monster to attack
     */
    selectMonster(monster) {
        if (monster.defeated || this.gameOver) return;

        this.selectedMonster = monster;
        this.updateMonsterDisplay();
        this.updateBoardSelection();
    }

    /**
     * Update the monster display in sidebar
     */
    updateMonsterDisplay() {
        if (!this.selectedMonster) {
            this.elements.monsterDisplay.innerHTML = '<p>Select a monster to attack</p>';
            return;
        }

        const m = this.selectedMonster;
        this.elements.monsterDisplay.innerHTML = `
            <div class="monster-icon">${m.icon}</div>
            <div class="monster-name">${m.name}</div>
            <div class="monster-hp">HP: ${Math.max(0, m.currentHp)}/${m.hp}</div>
            <div class="monster-hp-bar">
                <div class="monster-hp-fill" style="width: ${Math.max(0, (m.currentHp / m.hp) * 100)}%"></div>
            </div>
            <p style="margin-top: 10px; font-size: 0.9rem;">Damage: ${m.damage} | Exp Reward: ${m.exp}</p>
        `;
    }

    /**
     * Update board visual selection
     */
    updateBoardSelection() {
        document.querySelectorAll('.monster').forEach(el => {
            el.classList.remove('selected');
        });

        if (this.selectedMonster) {
            const element = document.getElementById(`monster-${this.selectedMonster.id}`);
            if (element) {
                element.classList.add('selected');
            }
        }
    }

    /**
     * Player attacks the selected monster
     */
    playerAttack() {
        if (this.gameOver || !this.selectedMonster || this.selectedMonster.defeated) {
            if (!this.selectedMonster || this.selectedMonster.defeated) {
                this.addMessage('❌ Please select a valid monster to attack!');
            }
            return;
        }

        this.turnCount++;
        this.player.defending = false;

        // Calculate player damage
        const baseDamage = 10 + this.player.powerLevel * 2;
        const variance = Math.floor(Math.random() * 6) - 2; // -2 to +4
        const playerDamage = Math.max(3, baseDamage + variance);

        // Attack the monster
        const actualDamage = this.selectedMonster.takeDamage(playerDamage);
        this.addMessage(`⚡ You dealt ${actualDamage} damage to ${this.selectedMonster.name}!`, 'log-damage');

        board.updateMonsterDisplay(this.selectedMonster);

        // Check if monster is defeated
        if (this.selectedMonster.defeated) {
            this.monsterDefeated(this.selectedMonster);
        } else {
            // Monster counterattacks
            setTimeout(() => this.monsterAttack(), 500);
        }

        this.updateUI();
    }

    /**
     * Player defends
     */
    playerDefend() {
        if (this.gameOver) return;

        this.turnCount++;
        this.player.defending = true;
        this.addMessage('🛡️ You take a defensive stance! Damage reduced by 50%.', 'log-defend');

        setTimeout(() => {
            if (this.selectedMonster && !this.selectedMonster.defeated) {
                this.monsterAttack();
            }
            this.player.defending = false;
            this.updateUI();
        }, 500);
    }

    /**
     * Player heals
     */
    playerHeal() {
        if (this.gameOver) return;

        const healAmount = 25;
        if (this.player.experience < this.player.healingCost) {
            this.addMessage(`💔 You need ${this.player.healingCost} health points to heal! Current: ${this.player.experience}`, 'log-damage');
            return;
        }

        this.turnCount++;
        this.player.defending = false;
        this.player.experience -= this.player.healingCost;
        this.player.health = Math.min(this.player.maxHealth, this.player.health + healAmount);

        this.addMessage(`💚 You healed ${healAmount} HP!`, 'log-heal');

        if (this.selectedMonster && !this.selectedMonster.defeated) {
            setTimeout(() => this.monsterAttack(), 500);
        }

        this.updateUI();
    }

    /**
     * Monster attacks the player
     */
    monsterAttack() {
        if (!this.selectedMonster || this.selectedMonster.defeated || this.gameOver) return;

        const monsterDamage = this.selectedMonster.attack();
        let actualDamage = monsterDamage;

        if (this.player.defending) {
            actualDamage = Math.floor(monsterDamage / 2);
            this.addMessage(`🛡️ ${this.selectedMonster.name} attacked! You blocked ${monsterDamage - actualDamage} damage!`, 'log-defend');
        } else {
            actualDamage = Math.max(1, monsterDamage - Math.floor(this.player.armor / 2));
            this.addMessage(`💥 ${this.selectedMonster.name} attacks for ${actualDamage} damage!`, 'log-damage');
        }

        this.player.health -= actualDamage;

        if (this.player.health <= 0) {
            this.player.health = 0;
            this.gameOverLose();
        }

        this.updateUI();
    }

    /**
     * Handle monster defeated
     */
    monsterDefeated(monster) {
        this.player.monstersDefeated++;
        this.player.score += monster.exp * 10;
        this.player.experience += monster.exp;

        this.addMessage(`🎉 Victory! Defeated ${monster.name}! Gained ${monster.exp} EXP and ${monster.exp * 10} points!`, 'log-victory');

        // Check for level up
        if (this.player.experience >= this.player.maxExperience) {
            this.levelUp();
        }

        // Check if all monsters defeated
        if (board.allMonstersDefeated()) {
            this.gameOverWin();
        } else {
            this.selectedMonster = null;
            this.updateMonsterDisplay();
            this.updateBoardSelection();
        }
    }

    /**
     * Level up the player
     */
    levelUp() {
        this.player.level++;
        this.player.experience = 0;
        this.player.maxExperience = 100 + this.player.level * 10;
        this.player.powerLevel++;
        this.player.armor += 5;
        this.player.maxHealth += 20;
        this.player.health = this.player.maxHealth;

        this.addMessage(`🌟 Level Up! You are now level ${this.player.level}!`, 'log-victory');
        this.addMessage(`💪 Power Level: ${this.player.powerLevel} | Armor: ${this.player.armor}`, 'log-victory');

        // Start next difficulty wave
        this.difficulty++;
        setTimeout(() => {
            this.addMessage(`🌊 A new wave of monsters appears!`);
            board.initialize(this.difficulty);
            this.updateUI();
        }, 1000);
    }

    /**
     * Game over - Player wins
     */
    gameOverWin() {
        this.gameOver = true;
        this.addMessage(`🏆 VICTORY! You defeated all monsters! Final Score: ${this.player.score}`, 'log-victory');
        this.showGameOverScreen(true);
    }

    /**
     * Game over - Player loses
     */
    gameOverLose() {
        this.gameOver = true;
        this.addMessage(`💀 GAME OVER! You were defeated! Final Score: ${this.player.score}`, 'log-damage');
        this.showGameOverScreen(false);
    }

    /**
     * Show game over screen
     */
    showGameOverScreen(won) {
        setTimeout(() => {
            const overlay = document.createElement('div');
            overlay.className = 'game-over-overlay';
            overlay.innerHTML = `
                <div class="game-over-content">
                    <h2>${won ? '🏆 VICTORY! 🏆' : '💀 GAME OVER 💀'}</h2>
                    <p>Final Level: ${this.player.level}</p>
                    <p>Monsters Defeated: ${this.player.monstersDefeated}</p>
                    <p>Final Score: ${this.player.score}</p>
                    <div class="game-over-buttons">
                        <button class="btn btn-primary" onclick="game.resetToWelcome();">🔙 Back to Menu</button>
                        <button class="btn btn-success" onclick="game.startNewGame();">🔄 Play Again</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }, 500);
    }

    /**
     * Update all UI elements
     */
    updateUI() {
        const healthPercentage = (this.player.health / this.player.maxHealth) * 100;
        const expPercentage = (this.player.experience / this.player.maxExperience) * 100;

        this.elements.playerHealth.style.width = healthPercentage + '%';
        this.elements.healthText.textContent = `${this.player.health}/${this.player.maxHealth}`;
        this.elements.score.textContent = this.player.score;
        this.elements.level.textContent = this.player.level;
        this.elements.monstersDefeated.textContent = this.player.monstersDefeated;
        this.elements.experience.textContent = `${this.player.experience}/${this.player.maxExperience}`;
        this.elements.expFill.style.width = expPercentage + '%';
        this.elements.powerLevel.textContent = this.player.powerLevel;
        this.elements.armor.textContent = this.player.armor;

        // Update button disabled states
        this.elements.attackBtn.disabled = this.gameOver || !this.selectedMonster || this.selectedMonster.defeated;
        this.elements.defendBtn.disabled = this.gameOver;
        this.elements.healBtn.disabled = this.gameOver || this.player.experience < this.player.healingCost;
    }

    /**
     * Add message to message log
     */
    addMessage(message, className = '') {
        this.showToastNotification(message, className);
    }

    /**
     * Show toast notification
     */
    showToastNotification(message, className = '') {
        // Create or get toast container
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${className}`;
        toast.textContent = message;

        container.appendChild(toast);

        // Determine duration based on message type
        let duration = 3000; // Default 3 seconds
        if (className === 'log-victory') {
            duration = 4000; // Victory messages last 4 seconds
        } else if (className === 'log-damage') {
            duration = 2500; // Damage messages are quick
        }

        // Auto-remove toast
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => {
                toast.remove();
            }, 400); // Wait for animation to finish
        }, duration);
    }

    /**
     * Clear message log
     */
    clearMessages() {
        // Clear all toast notifications
        const container = document.querySelector('.toast-container');
        if (container) {
            container.remove();
        }
    }
}

// Initialize game when DOM is ready
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});
