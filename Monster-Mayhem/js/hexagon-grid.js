/**
 * Hexagonal Grid System
 * Creates a seamless hexagonal grid with no gaps
 */

class HexagonGrid {
    constructor(containerId, cols = 10, rows = 10, hexSize = 35) {
        this.container = document.getElementById(containerId);
        this.cols = cols;
        this.rows = rows;
        this.hexSize = hexSize;
        this.hexagons = new Map();
        this.selectedHex = null;
        this.hoveredHex = null;
        
        // Calculate dimensions using regular gapless flat-topped hexagon math
        this.width = (cols - 1) * hexSize * 1.5 + hexSize * 2;
        this.height = rows * hexSize * Math.sqrt(3) + hexSize * Math.sqrt(3) / 2;
        
        this.setupContainer();
        this.generateGrid();
        this.setupEventListeners();
    }

    /**
     * Setup container styling
     */
    setupContainer() {
        this.container.style.width = this.width + 'px';
        this.container.style.height = this.height + 'px';
        this.container.style.position = 'relative';
        this.container.style.margin = '20px auto';
        this.container.classList.add('hex-grid-container');
    }

    /**
     * Generate hexagonal grid
     */
    generateGrid() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.createHexagon(col, row);
            }
        }
    }

    /**
     * Create individual hexagon
     */
    createHexagon(col, row) {
        const hex = document.createElement('div');
        const id = `hex-${col}-${row}`;
        hex.id = id;
        hex.className = 'hexagon';
        
        // Calculate position using gapless mathematical spacing
        const size = this.hexSize;
        const x = col * size * 1.5;
        const y = row * size * Math.sqrt(3) + (col % 2) * size * Math.sqrt(3) / 2;
        
        hex.style.left = x + 'px';
        hex.style.top = y + 'px';
        hex.style.width = (size * 2) + 'px';
        hex.style.height = (size * Math.sqrt(3)) + 'px';
        
        // Create hexagon shape using clip-path
        this.createHexShape(hex);
        
        // Store hex data
        const hexData = {
            element: hex,
            col: col,
            row: row,
            id: id,
            occupied: false,
            character: null
        };
        
        this.hexagons.set(id, hexData);
        
        // Add event listeners
        hex.addEventListener('mouseenter', () => this.onHexHover(id));
        hex.addEventListener('mouseleave', () => this.onHexHoverEnd(id));
        hex.addEventListener('click', () => this.onHexClick(id));
        
        this.container.appendChild(hex);
    }

    /**
     * Create hexagon shape using clip-path
     */
    createHexShape(element) {
        element.style.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
        element.style.position = 'absolute';
        element.style.background = 'linear-gradient(135deg, #1a3d0a 0%, #0f2408 100%)';
        element.style.border = '2px solid #ffd93d';
        element.style.cursor = 'pointer';
        element.style.transition = 'all 0.2s ease';
        element.style.display = 'flex';
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
    }

    /**
     * Hexagon hover effect
     */
    onHexHover(hexId) {
        const hexData = this.hexagons.get(hexId);
        if (!hexData) return;
        
        // Don't override selected state
        if (this.selectedHex && this.selectedHex.id === hexId) return;
        
        this.hoveredHex = hexData;
        hexData.element.classList.add('hex-hover');
        hexData.element.style.boxShadow = '0 0 20px rgba(255, 217, 61, 0.6), inset 0 0 15px rgba(255, 217, 61, 0.3)';
    }

    /**
     * Hexagon hover end
     */
    onHexHoverEnd(hexId) {
        const hexData = this.hexagons.get(hexId);
        if (!hexData) return;
        
        // Don't remove if selected
        if (this.selectedHex && this.selectedHex.id === hexId) return;
        
        this.hoveredHex = null;
        hexData.element.classList.remove('hex-hover');
        hexData.element.style.boxShadow = 'none';
    }

    /**
     * Hexagon click/selection
     */
    onHexClick(hexId) {
        const hexData = this.hexagons.get(hexId);
        if (!hexData) return;
        
        // If clicking the same hex, deselect
        if (this.selectedHex && this.selectedHex.id === hexId) {
            this.deselectHexagon();
            return;
        }
        
        // Deselect previous
        if (this.selectedHex) {
            this.selectedHex.element.classList.remove('hex-selected');
            this.selectedHex.element.style.boxShadow = 'none';
        }
        
        // Select new
        this.selectedHex = hexData;
        hexData.element.classList.add('hex-selected');
        hexData.element.style.boxShadow = '0 0 30px rgba(255, 107, 107, 0.8), inset 0 0 20px rgba(255, 107, 107, 0.4)';
        
        // Fire selection event
        this.onHexSelected(hexData);
    }

    /**
     * Deselect hexagon
     */
    deselectHexagon() {
        if (!this.selectedHex) return;
        
        this.selectedHex.element.classList.remove('hex-selected');
        this.selectedHex.element.style.boxShadow = 'none';
        this.selectedHex = null;
        
        this.onHexDeselected();
    }

    /**
     * Get neighboring hexagons
     */
    getNeighbors(hexId) {
        const hexData = this.hexagons.get(hexId);
        if (!hexData) return [];
        
        const col = hexData.col;
        const row = hexData.row;
        const neighbors = [];
        
        // Hex neighbors based on offset coordinates
        const offsets = col % 2 === 0 
            ? [
                [0, -1], [1, -1], [1, 0],
                [0, 1], [-1, 0], [-1, -1]
              ]
            : [
                [0, -1], [1, 0], [1, 1],
                [0, 1], [-1, 1], [-1, 0]
              ];
        
        offsets.forEach(([dcol, drow]) => {
            const newCol = col + dcol;
            const newRow = row + drow;
            
            if (newCol >= 0 && newCol < this.cols && newRow >= 0 && newRow < this.rows) {
                neighbors.push(this.hexagons.get(`hex-${newCol}-${newRow}`));
            }
        });
        
        return neighbors;
    }

    /**
     * Find path between two hexagons (A* algorithm)
     */
    findPath(startId, endId, range = Infinity) {
        const start = this.hexagons.get(startId);
        const end = this.hexagons.get(endId);
        
        if (!start || !end) return [];
        
        const openSet = new Set([start]);
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();
        
        const heuristic = (a, b) => {
            const dx = a.col - b.col;
            const dy = a.row - b.row;
            return Math.sqrt(dx * dx + dy * dy);
        };
        
        // Initialize scores
        this.hexagons.forEach(hex => {
            gScore.set(hex.id, Infinity);
            fScore.set(hex.id, Infinity);
        });
        
        gScore.set(start.id, 0);
        fScore.set(start.id, heuristic(start, end));
        
        while (openSet.size > 0) {
            let current = null;
            let lowestF = Infinity;
            
            openSet.forEach(hex => {
                if (fScore.get(hex.id) < lowestF) {
                    lowestF = fScore.get(hex.id);
                    current = hex;
                }
            });
            
            if (current.id === end.id) {
                // Reconstruct path
                const path = [current];
                while (cameFrom.has(current.id)) {
                    current = cameFrom.get(current.id);
                    path.unshift(current);
                }
                return path.slice(0, range + 1);
            }
            
            openSet.delete(current);
            const neighbors = this.getNeighbors(current.id);
            
            neighbors.forEach(neighbor => {
                // If the neighbor is occupied and is not the destination, skip it (treat as obstacle)
                if (neighbor.occupied && neighbor.id !== end.id) {
                    return;
                }
                const tentativeG = gScore.get(current.id) + 1;
                
                if (tentativeG < gScore.get(neighbor.id)) {
                    cameFrom.set(neighbor.id, current);
                    gScore.set(neighbor.id, tentativeG);
                    fScore.set(neighbor.id, tentativeG + heuristic(neighbor, end));
                    openSet.add(neighbor);
                }
            });
        }
        
        return [];
    }

    /**
     * Highlight path
     */
    highlightPath(hexIds, color = 'rgba(78, 205, 196, 0.4)') {
        hexIds.forEach((id, index) => {
            const hexData = this.hexagons.get(id);
            if (hexData) {
                hexData.element.classList.add('hex-path');
                hexData.element.style.background = color;
                
                if (index > 0 && index < hexIds.length - 1) {
                    hexData.element.style.opacity = 0.6;
                }
            }
        });
    }

    /**
     * Clear path highlighting
     */
    clearPathHighlight() {
        this.hexagons.forEach(hex => {
            hex.element.classList.remove('hex-path');
            hex.element.style.background = 'linear-gradient(135deg, #1a3d0a 0%, #0f2408 100%)';
            hex.element.style.opacity = 1;
        });
    }

    /**
     * Place character on hexagon
     */
    placeCharacter(hexId, character) {
        const hexData = this.hexagons.get(hexId);
        if (!hexData) return false;
        
        // Remove from previous location
        if (character.hexId) {
            const prevHex = this.hexagons.get(character.hexId);
            if (prevHex) {
                prevHex.occupied = false;
                prevHex.character = null;
                prevHex.element.innerHTML = '';
            }
        }
        
        // Add to new location
        hexData.occupied = true;
        hexData.character = character;
        character.hexId = hexId;
        
        hexData.element.innerHTML = character.icon;
        hexData.element.style.fontSize = this.hexSize * 0.6 + 'px';
        
        return true;
    }

    /**
     * Move character with path visualization
     */
    moveCharacter(character, targetId, range = 5) {
        const path = this.findPath(character.hexId, targetId, range);
        
        if (path.length === 0) return false;
        
        // Clear old position
        const oldHex = this.getHexagonById(character.hexId);
        if (oldHex) {
            oldHex.element.innerHTML = '';
            oldHex.occupied = false;
            oldHex.character = null;
        }
        
        // Show path
        this.highlightPath(path.map(h => h.id));
        
        // Animate movement
        let step = 0;
        const moveInterval = setInterval(() => {
            step++;
            
            if (step < path.length) {
                this.placeCharacter(path[step].id, character);
            } else {
                clearInterval(moveInterval);
                this.clearPathHighlight();
                // Update character's hex ID to reflect actual final position
                character.hexId = path[path.length - 1].id;
                this.onCharacterMoved(character);
            }
        }, 200);
        
        return true;
    }

    /**
     * Get hexagon at coordinates
     */
    getHexagonById(hexId) {
        return this.hexagons.get(hexId);
    }

    /**
     * Get all hexagons
     */
    getAllHexagons() {
        return Array.from(this.hexagons.values());
    }

    /**
     * Callbacks (override in subclass or set via properties)
     */
    onHexSelected(hexData) {
        // Override in game
    }

    onHexDeselected() {
        // Override in game
    }

    onCharacterMoved(character) {
        // Override in game
    }

    setupEventListeners() {
        // Setup any global event listeners
    }
}

// Create global hexagon grid instance
let hexagonGrid = null;
