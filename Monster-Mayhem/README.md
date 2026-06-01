# ⚔️ Monster Mayhem - Web Game

A thrilling, interactive web-based game where you battle increasingly difficult waves of monsters! Defeat monsters, gain experience, level up, and survive the ultimate Monster Mayhem!

## 🎮 Features

### Welcome Screen
- **Beautiful Introduction**: Professional welcome screen with detailed instructions
- **How to Play Guide**: Step-by-step instructions with visual cards
- **Game Mechanics Explained**: Comprehensive breakdown of all systems
- **Monster Showcase**: Preview of all 8 monster types
- **Pro Tips**: Strategic advice for successful gameplay

### Core Gameplay
- **Dynamic Monster Board**: 8 different monster types with unique stats and abilities
- **Strategic Combat System**: Attack, Defend, and Heal mechanics
- **Progressive Difficulty**: Game gets harder after each wave
- **Experience & Leveling**: Gain experience to level up and improve stats
- **Health Management**: Strategic use of healing abilities
- **Real-time Stats Tracking**: Monitor health, level, power, and armor

### Monster Types
- 👹 **Goblin** - Weak, quick
- 🧌 **Orc** - Medium strength
- 👺 **Troll** - Heavy hitter
- 🐉 **Dragon** - Ultra powerful
- 🐺 **Werewolf** - Fast attacker
- 💀 **Skeleton** - Undead threat
- 🧙‍♀️ **Witch** - Magical damage
- 😈 **Demon** - Infernal power

### Game Mechanics
- **Attack**: Deal damage based on your power level
- **Defend**: Reduce incoming damage by 50%
- **Heal**: Restore 25 HP (costs experience points)
- **Monster Selection**: Click monsters to target them
- **Progressive Waves**: Defeat all monsters to advance to the next level

### Player Progression
- **Experience Points**: Earn from defeating monsters
- **Level System**: Level up when reaching 100 EXP
- **Power Level**: Increases with each level (boosts damage)
- **Armor**: Reduces incoming damage
- **Score**: Points based on monster difficulty

### Statistics
- Tracks games played and won
- High score recording
- Total monsters defeated
- Win rate calculation
- Session statistics storage

### User Experience
- **Welcome Instructions**: Complete guide before starting
- **Keyboard Shortcuts**: A=Attack, D=Defend, H=Heal
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Feedback**: Message log shows all game events
- **Sound Effects**: Audio feedback for actions (where supported)
- **Animations**: Smooth, engaging visual feedback
- **Accessibility**: Keyboard navigation support
- **Professional UI**: Modern, polished interface design

## 🕹️ How to Play

### Starting the Game
1. Open `index.html` in your web browser
2. You'll see the beautiful welcome screen with detailed instructions
3. Read through the "How to Play" guide to learn the basics
4. Review game mechanics and monster types
5. Click the "🚀 START ADVENTURE" button to begin
6. Or press Enter to start playing

### During Combat
1. **Attack (A)**: Click "Attack" or press A to damage your selected monster
2. **Defend (D)**: Click "Defend" or press D to reduce incoming damage
3. **Heal (H)**: Click "Heal" or press H to restore health (costs experience)
4. **Switch Target**: Click a different monster to change targets

### Winning
- Defeat all monsters on the board to complete the level
- Advance to the next level with increased difficulty
- Try to reach the highest level possible!

### Game Over
- Game ends when your health reaches 0
- Your final score, level, and monsters defeated are displayed
- Click "Back to Menu" to return to the welcome screen or "Play Again" for a new game

## 📊 Game Mechanics Explained

### Damage Calculation
- **Player Damage**: `(10 + PowerLevel * 2) + Random(−2 to +4)`
- **Monster Damage**: `MonsterDamage + Random(−2 to +2)`
- **Defense Reduction**: 50% damage reduction when defending
- **Armor Mitigation**: Reduces monster damage by `Armor / 2`

### Experience & Leveling
- Each monster defeated grants experience (10-50 based on difficulty)
- Accumulate 100 EXP to level up
- Each level up grants:
  - +1 Power Level (increases damage)
  - +5 Armor (increases defense)
  - +20 Max Health
  - +10 Max Experience requirement

### Difficulty Scaling
- Starting: 4 monsters
- Each level adds 1 more monster to the board
- Monster stats scale with difficulty:
  - HP increases
  - Damage increases
  - Experience rewards increase

## 🎯 Strategy Tips

1. **Focus Fire**: Attack one monster at a time to defeat them quickly
2. **Manage Health**: Use Defend when health is below 50%
3. **Heal Wisely**: Healing costs experience, so plan ahead
4. **Prioritize Threats**: Focus on high-damage monsters first
5. **Build Up**: In early levels, accumulate experience for better stats
6. **Level Up First**: Let levels increase your stats before rushing new levels

## 📁 Project Structure

```
Monster-Mayhem/
├── index.html           # Main HTML file
├── css/
│   └── style.css       # Styling and animations
├── js/
│   ├── board.js        # Board and monster management
│   ├── game.js         # Core game logic
│   └── interaction.js  # User interactions and events
└── README.md           # This file
```

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Flexbox, Grid, Animations, Gradients
- **JavaScript (ES6+)**: Classes, Arrow Functions, Template Literals
- **Web Audio API**: Optional sound effects
- **LocalStorage**: Statistics persistence

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full responsive support

### Performance
- Optimized rendering with CSS animations
- Efficient DOM manipulation
- LocalStorage for statistics persistence
- Smooth 60 FPS animations

## 🎨 Customization

### Modify Monster Types
Edit the `monsterTypes` array in `board.js` to add custom monsters with different stats.

### Adjust Difficulty
Modify the scaling factors in:
- `Monster` class HP calculations
- Player damage formulas in `playerAttack()`
- Experience rewards in `monsterDefeated()`

### Change Colors
Update CSS variables in `style.css`:
```css
:root {
    --primary-color: #ff6b6b;
    --secondary-color: #4ecdc4;
    --success-color: #51cf66;
    /* ... more variables */
}
```

## 🚀 Future Enhancements

Potential features to add:
- [ ] Special abilities for players
- [ ] Monster boss battles
- [ ] Inventory system
- [ ] Power-ups
- [ ] Multiplayer mode
- [ ] Achievements system
- [ ] Difficulty presets
- [ ] Game music
- [ ] Leaderboard
- [ ] Save/Load game state

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Developer Notes

### Code Structure
- **board.js**: Handles game board state and monster objects
- **game.js**: Manages player state, turn logic, and game flow
- **interaction.js**: Handles user input, events, and statistics

### Key Classes
- `Board`: Manages monster placement and rendering
- `Monster`: Individual monster data and methods
- `Game`: Main game engine and state management
- `Interaction`: User input handling
- `StatisticsTracker`: Game statistics persistence
- `SoundManager`: Audio feedback system
- `PerformanceMonitor`: Performance metrics

## 🎮 Enjoy the Game!

Monster Mayhem is ready to play! Good luck, hero! ⚔️

---

**Last Updated**: 2024
**Version**: 1.1 - Professional Welcome Screen Added
