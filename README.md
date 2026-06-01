# Web-project
Repository to keep track of web development assessments and projects.

## 🎮 Monster Mayhem - Complete Game

A fully functional, interactive web-based monster battle game with:

### ✨ Features
- **Professional Welcome Screen**: Beautiful intro with complete instructions and tips
- **How to Play Guide**: Visual cards explaining all game mechanics
- **Monster Showcase**: Preview of all 8 unique monster types
- **8 Monster Types**: Goblin, Orc, Troll, Dragon, Werewolf, Skeleton, Witch, Demon
- **Strategic Combat**: Attack, Defend, and Heal mechanics with tactical depth
- **Progressive Difficulty**: Each level gets harder with more monsters
- **Leveling System**: Gain experience and level up to increase power
- **Real-time Stats**: Track health, score, level, power, and armor
- **Keyboard Controls**: A=Attack, D=Defend, H=Heal for quick gameplay
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Sound Effects**: Audio feedback for actions
- **Animations**: Smooth, engaging visual effects
- **Statistics Tracking**: Records games played, wins, high score, and more

### 🎯 How to Play
1. Open `Monster-Mayhem/index.html` in your browser
2. You'll see a professional welcome screen with detailed instructions
3. Read through the "How to Play" guide to learn the basics
4. Review game mechanics and all monster types
5. Click the "🚀 START ADVENTURE" button to begin (or press Enter)
6. Select monsters by clicking on them
7. Use **A** to attack, **D** to defend, **H** to heal
8. Defeat all monsters to advance to the next level
9. Level up to increase your power and survive harder waves!

### 🏗️ Project Structure
```
Monster-Mayhem/
├── index.html              # Main game file
├── README.md               # Detailed documentation
├── css/
│   └── style.css          # Complete styling and animations
└── js/
    ├── board.js           # Board and monster management (140+ lines)
    ├── game.js            # Core game engine (400+ lines)
    └── interaction.js     # User interactions and events (300+ lines)
```

### 💻 Technical Stack
- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Animations, Gradients
- **JavaScript (ES6+)**: Classes, ES6 features, Web APIs
- **LocalStorage**: Statistics persistence
- **Web Audio API**: Sound effects

### 🎨 Game Features Explained

**Combat System:**
- Calculate damage with variance for tactical depth
- Defense reduces incoming damage by 50%
- Armor mitigates monster damage
- Healing costs experience points

**Progression:**
- Experience from defeated monsters
- Level up at 100 EXP to gain power
- Each level increases: Power Level, Armor, Max Health
- Difficulty scales with each level

**Monster Variety:**
- Each monster type has unique stats
- Different HP, damage, and experience values
- Difficulty-based scaling
- Dynamic spawn system

### 🚀 Ready to Play!
All files are complete and tested. Simply open `Monster-Mayhem/index.html` in any modern browser to start playing! 

---

**Version**: 1.1 - Professional Welcome Screen Edition ✨
**Last Updated**: 2024 
