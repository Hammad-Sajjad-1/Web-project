/**
 * Hexagon Game Mode
 * Integrates hexagonal grid with Monster Mayhem mechanics
 */

class HexagonGameMode {
    constructor(game) {
        this.game = game;
        this.hexGrid = null;
        this.playerCharacter = null;
        this.monsters = [];
        this.selectedMonsterHex = null;
        this.movementRange = 5;
    }

    /**
     * Initialize hexagon game mode
     */
    initialize() {
        // Create hexagon grid (10x10 with size 35 for regular gapless grid)
        this.hexGrid = new HexagonGrid('hexGridContainer', 10, 10, 35);
        
        // Setup callbacks
        this.hexGrid.onHexSelected = (hexData) => this.onHexSelected(hexData);
        this.hexGrid.onHexDeselected = () => this.onHexDeselected();
        
        // Create player character with getters and setters for real-time state sync
        const gameInstance = this.game;
        this.playerCharacter = {
            icon: '🧙‍♂️',
            get health() { return gameInstance.player.health; },
            set health(val) { gameInstance.player.health = val; },
            get maxHealth() { return gameInstance.player.maxHealth; },
            set maxHealth(val) { gameInstance.player.maxHealth = val; },
            get powerLevel() { return gameInstance.player.powerLevel; },
            set powerLevel(val) { gameInstance.player.powerLevel = val; },
            hexId: 'hex-0-0',
            name: 'Player'
        };
        
        // Place player on starting hex
        this.hexGrid.placeCharacter(this.playerCharacter.hexId, this.playerCharacter);
        
        // Spawn monsters
        this.spawnMonsters();
        
        // Setup UI
        this.setupUI();
    }

    /**
     * Spawn monsters on random hexagons
     */
    spawnMonsters() {
        const allHexagons = this.hexGrid.getAllHexagons();
        const monsterTypes = [
            { name: 'Goblin', hp: 30, icon: '👹', damage: 5 },
            { name: 'Orc', hp: 50, icon: '🧌', damage: 8 },
            { name: 'Troll', hp: 70, icon: '👺', damage: 12 },
            { name: 'Dragon', hp: 100, icon: '🐉', damage: 20 }
        ];
        
        for (let i = 0; i < 4; i++) {
            // Get random hex that's not occupied
            let randomHex;
            do {
                randomHex = allHexagons[Math.floor(Math.random() * allHexagons.length)];
            } while (randomHex.occupied);
            
            const type = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
            const monster = {
                name: type.name + '-' + i,
                icon: type.icon,
                hp: type.hp,
                currentHp: type.hp,
                maxHp: type.hp,
                damage: type.damage,
                hexId: randomHex.id
            };
            
            this.monsters.push(monster);
            this.hexGrid.placeCharacter(monster.hexId, monster);
        }
    }

    /**
     * Setup UI elements
     */
    setupUI() {
        const moveBtn = document.getElementById('hexMoveBtn');
        const attackBtn = document.getElementById('hexAttackBtn');
        const backBtn = document.getElementById('switchGameModeBtn');
        
        moveBtn.onclick = () => this.movePlayerToSelected();
        attackBtn.onclick = () => this.attackSelectedMonster();
        backBtn.onclick = () => this.game.switchGameMode('classic');
        
        // Update player position display
        this.updatePlayerPositionDisplay();
    }

    /**
     * Update player position display
     */
    updatePlayerPositionDisplay() {
        const posSpan = document.getElementById('hexPlayerPos');
        if (posSpan && this.playerCharacter) {
            const hex = this.hexGrid.getHexagonById(this.playerCharacter.hexId);
            if (hex) {
                posSpan.textContent = `${hex.col}, ${hex.row}`;
            }
        }
    }

    /**
     * Handle hexagon selection
     */
    onHexSelected(hexData) {
        const infoBox = document.getElementById('hexInfoBox');
        const selectedSpan = document.getElementById('hexSelected');
        
        const hex = hexData;
        const details = [];
        details.push(`<strong>Position:</strong> Col ${hex.col}, Row ${hex.row}`);
        details.push(`<strong>ID:</strong> ${hex.id}`);
        
        if (hex.occupied && hex.character) {
            details.push(`<strong>Character:</strong> ${hex.character.icon} ${hex.character.name || 'Player'}`);
            if (hex.character.currentHp) {
                details.push(`<strong>HP:</strong> ${hex.character.currentHp}/${hex.character.maxHp}`);
            }
        } else {
            details.push(`<strong>Status:</strong> Empty`);
        }
        
        // Calculate distance from player
        const path = this.hexGrid.findPath(this.playerCharacter.hexId, hex.id);
        const distance = path.length - 1;
        details.push(`<strong>Distance:</strong> ${distance} hex(s)`);
        
        infoBox.innerHTML = details.join('<br>');
        selectedSpan.textContent = `${hex.col}, ${hex.row}`;
        
        this.selectedMonsterHex = hex;
    }

    /**
     * Handle hexagon deselection
     */
    onHexDeselected() {
        const infoBox = document.getElementById('hexInfoBox');
        infoBox.innerHTML = '<p>Select a hexagon to view details</p>';
        document.getElementById('hexSelected').textContent = 'None';
        this.selectedMonsterHex = null;
    }

    /**
     * Move player to selected hexagon
     */
    movePlayerToSelected() {
        if (!this.selectedMonsterHex) {
            this.game.addMessage('❌ Select a hexagon to move to!', 'log-damage');
            return;
        }
        
        // Check if target is occupied
        if (this.selectedMonsterHex.occupied && this.selectedMonsterHex.character !== this.playerCharacter) {
            this.game.addMessage('❌ That hexagon is occupied!', 'log-damage');
            return;
        }
        
        // Check path and range
        const path = this.hexGrid.findPath(this.playerCharacter.hexId, this.selectedMonsterHex.id);
        if (path.length === 0) {
            this.game.addMessage('❌ Cannot find a path to that hexagon!', 'log-damage');
            return;
        }
        const distance = path.length - 1;
        if (distance > this.movementRange) {
            this.game.addMessage(`❌ That hexagon is out of movement range! Max: ${this.movementRange} hexes`, 'log-damage');
            return;
        }
        
        // Move player
        const success = this.hexGrid.moveCharacter(
            this.playerCharacter, 
            this.selectedMonsterHex.id, 
            this.movementRange
        );
        
        if (success) {
            this.game.addMessage(`🚶 Moving to hexagon...`, 'log-defend');
            // Update position display after move animation completes
            setTimeout(() => this.updatePlayerPositionDisplay(), 1000);
        } else {
            this.game.addMessage(`❌ Cannot reach that hexagon!`, 'log-damage');
        }
    }

    /**
     * Attack selected monster
     */
    attackSelectedMonster() {
        if (!this.selectedMonsterHex) {
            this.game.addMessage('❌ Select a monster to attack!', 'log-damage');
            return;
        }
        
        if (!this.selectedMonsterHex.occupied || !this.selectedMonsterHex.character) {
            this.game.addMessage('❌ No monster there!', 'log-damage');
            return;
        }
        
        const monster = this.selectedMonsterHex.character;
        if (monster === this.playerCharacter) {
            this.game.addMessage('❌ Cannot attack yourself!', 'log-damage');
            return;
        }
        
        // Check distance
        const path = this.hexGrid.findPath(this.playerCharacter.hexId, this.selectedMonsterHex.id);
        const distance = path.length - 1;
        
        if (distance > 1) {
            this.game.addMessage('❌ Monster is too far away! Move closer to attack.', 'log-damage');
            return;
        }
        
        // Perform attack
        const damage = 10 + this.game.player.powerLevel * 2 + Math.floor(Math.random() * 5);
        monster.currentHp -= damage;
        
        this.game.addMessage(`⚡ You dealt ${damage} damage to ${monster.icon}!`, 'log-damage');
        
        if (monster.currentHp <= 0) {
            this.monsterDefeated(monster);
        } else {
            // Monster counterattack
            setTimeout(() => this.monsterAttack(monster), 500);
        }
    }

    /**
     * Monster attacks player
     */
    monsterAttack(monster) {
        const damage = monster.damage + Math.floor(Math.random() * 3) - 1;
        this.playerCharacter.health -= damage;
        
        this.game.addMessage(`💥 ${monster.icon} attacks for ${damage} damage!`, 'log-damage');
        
        if (this.playerCharacter.health <= 0) {
            this.playerCharacter.health = 0;
            this.game.addMessage(`💀 You were defeated!`, 'log-damage');
            this.gameOverHex();
        } else {
            this.game.updateUI();
        }
    }

    /**
     * Monster defeated
     */
    monsterDefeated(monster) {
        const index = this.monsters.indexOf(monster);
        if (index > -1) {
            this.monsters.splice(index, 1);
        }
        
        // Remove monster from hex
        const hex = this.hexGrid.getHexagonById(monster.hexId);
        if (hex) {
            hex.element.innerHTML = '';
            hex.occupied = false;
            hex.character = null;
        }
        
        // Update player stats
        this.game.player.monstersDefeated++;
        this.game.player.experience += 20;
        this.game.player.score += 100;
        
        this.game.addMessage(`🎉 Defeated ${monster.icon}!`, 'log-victory');
        
        // Check for level up
        if (this.game.player.experience >= this.game.player.maxExperience) {
            this.game.levelUp();
        }
        
        this.game.updateUI();
        
        if (this.monsters.length === 0) {
            this.gameOverHexWin();
        }
    }

    /**
     * Game over - player wins
     */
    gameOverHexWin() {
        this.game.gameOverWin();
    }

    /**
     * Game over - player loses
     */
    gameOverHex() {
        this.game.gameOverLose();
    }

    /**
     * Cleanup
     */
    cleanup() {
        if (this.hexGrid && this.hexGrid.container) {
            this.hexGrid.container.innerHTML = '';
        }
    }
}

// Create global hexagon game mode instance
let hexagonGameMode = null;
