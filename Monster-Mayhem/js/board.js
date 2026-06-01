/**
 * Board Management System
 * Handles monster creation, placement, and board state
 */

class Board {
    constructor() {
        this.monsters = [];
        this.boardElement = document.getElementById('gameBoard');
    }

    /**
     * Initialize the game board with monsters
     */
    initialize(difficulty = 1) {
        this.monsters = [];
        this.boardElement.innerHTML = '';
        
        const monsterCount = 4 + difficulty;
        const monsterTypes = [
            { name: 'Goblin', hp: 30 + difficulty * 5, icon: '👹', damage: 5, exp: 10 },
            { name: 'Orc', hp: 50 + difficulty * 8, icon: '🧌', damage: 8, exp: 15 },
            { name: 'Troll', hp: 70 + difficulty * 10, icon: '👺', damage: 12, exp: 25 },
            { name: 'Dragon', hp: 100 + difficulty * 15, icon: '🐉', damage: 20, exp: 50 },
            { name: 'Werewolf', hp: 60 + difficulty * 9, icon: '🐺', damage: 10, exp: 20 },
            { name: 'Skeleton', hp: 40 + difficulty * 6, icon: '💀', damage: 7, exp: 12 },
            { name: 'Witch', hp: 45 + difficulty * 7, icon: '🧙‍♀️', damage: 9, exp: 18 },
            { name: 'Demon', hp: 80 + difficulty * 12, icon: '😈', damage: 15, exp: 35 }
        ];

        for (let i = 0; i < monsterCount; i++) {
            const type = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
            const monster = new Monster(
                `${type.name}-${i}`,
                type.name,
                type.hp,
                type.icon,
                type.damage,
                type.exp
            );
            this.monsters.push(monster);
            this.renderMonster(monster);
        }
    }

    /**
     * Render a single monster on the board
     */
    renderMonster(monster) {
        const element = document.createElement('div');
        element.className = 'monster';
        element.id = `monster-${monster.id}`;
        
        if (monster.defeated) {
            element.classList.add('defeated');
        }

        element.innerHTML = `
            <div class="monster-icon">${monster.icon}</div>
            <div class="monster-name">${monster.name}</div>
            <div class="monster-hp">HP: ${monster.currentHp}/${monster.hp}</div>
            <div class="monster-hp-bar">
                <div class="monster-hp-fill" style="width: ${(monster.currentHp / monster.hp) * 100}%"></div>
            </div>
        `;

        element.addEventListener('click', () => {
            if (!monster.defeated) {
                game.selectMonster(monster);
            }
        });

        this.boardElement.appendChild(element);
    }

    /**
     * Update monster display on board
     */
    updateMonsterDisplay(monster) {
        const element = document.getElementById(`monster-${monster.id}`);
        if (element) {
            const hpPercentage = (monster.currentHp / monster.hp) * 100;
            element.innerHTML = `
                <div class="monster-icon">${monster.icon}</div>
                <div class="monster-name">${monster.name}</div>
                <div class="monster-hp">HP: ${Math.max(0, monster.currentHp)}/${monster.hp}</div>
                <div class="monster-hp-bar">
                    <div class="monster-hp-fill" style="width: ${Math.max(0, hpPercentage)}%"></div>
                </div>
            `;

            if (monster.defeated) {
                element.classList.add('defeated');
                element.style.opacity = '0.3';
            }
        }
    }

    /**
     * Get a monster by ID
     */
    getMonster(id) {
        return this.monsters.find(m => m.id === id);
    }

    /**
     * Get all alive monsters
     */
    getAliveMonsters() {
        return this.monsters.filter(m => !m.defeated);
    }

    /**
     * Check if all monsters are defeated
     */
    allMonstersDefeated() {
        return this.getAliveMonsters().length === 0;
    }

    /**
     * Clear the board
     */
    clear() {
        this.monsters = [];
        this.boardElement.innerHTML = '';
    }
}

/**
 * Monster Class
 * Represents individual monsters on the board
 */
class Monster {
    constructor(id, name, hp, icon, damage, exp) {
        this.id = id;
        this.name = name;
        this.hp = hp;
        this.currentHp = hp;
        this.icon = icon;
        this.damage = damage;
        this.exp = exp;
        this.defeated = false;
        this.defending = false;
    }

    /**
     * Take damage from an attack
     */
    takeDamage(amount) {
        const actualDamage = this.defending ? Math.floor(amount / 2) : amount;
        this.currentHp -= actualDamage;
        
        if (this.currentHp <= 0) {
            this.currentHp = 0;
            this.defeated = true;
        }
        
        return actualDamage;
    }

    /**
     * Monster attacks the player
     */
    attack() {
        const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(1, this.damage + variance);
    }

    /**
     * Monster defends
     */
    defend() {
        this.defending = true;
        setTimeout(() => {
            this.defending = false;
        }, 1000);
    }

    /**
     * Reset monster for new round
     */
    reset() {
        this.defending = false;
    }
}

// Initialize board when DOM is ready
const board = new Board();
