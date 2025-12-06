# Substrate Visualizer

An interactive generative art visualization inspired by Jared Tarbell's Substrate algorithm. Watch organic crack patterns grow and branch across your screen with particle effects and smooth animations.

![Substrate Animation](preview.gif)

## Features

### Core Visualization
- **Organic Line Growth** - Lines (cracks) grow across the canvas and branch when colliding
- **Smart Collision Detection** - Lines detect intersections and create new branches at collision points
- **Curved Lines** - Configurable probability for curved/circular line segments
- **Particle Effects** - Sparkler-style particles at line tips with gravity simulation
- **Sand Gradient** - Colorful gradient particles along line edges (configurable: single side, both sides, or disabled)

### Visual Modes
- **OLED Mode** - Black background with vibrant glowing colors, optimized for OLED displays
- **Normal Mode** - White background with darker line colors (classic Substrate look)
- **Customizable Colors** - Full RGB color configuration for lines, background, and particles

### Interaction
- **Click to Spawn** - Click anywhere to create new crack lines
- **Cursor Sparkles** - Optional particle effect following your mouse cursor
- **Responsive Canvas** - Automatically adjusts to window resizing while preserving artwork

### Advanced Features
- **Branch Modes**:
  - `perpendicular` - Lines branch at ±90° angles (classic Substrate)
  - `opposite` - Lines can branch at ±90° or ±180° (enables u-turns)
  - `any` - Lines branch in any direction (0-360°)
- **Line Drift** - Lines can gradually bend while drawing for more organic shapes
- **Auto-Reset** - Configurable timer for automatic canvas reset with smooth fade transitions
- **Hard Reset Cycles** - Complete fade-to-black reset after X soft resets

## Installation

1. Clone this repository:
git clone https://github.com/yourusername/substrate-visualizer.git
cd substrate-visualizer

text

2. Open `Substrate.html` in your web browser - no build process required!

## Configuration

Edit the `CONFIG` object at the top of the script to customize behavior:

### Line Behavior
STEP: 0.7, // Line speed (pixels per frame)
INITIAL_CRACKS: 3, // Starting number of lines
MAX_CRACKS: 100, // Maximum concurrent lines
CIRCLE_PERCENT: 40, // Curved line probability (%)
BRANCH_MODE: 'perpendicular', // 'perpendicular', 'opposite', 'any'

text

### Visual Effects
LINE_WIDTH: 1, // Crack line thickness
GRAINS: 64, // Sand particles per line
SAND_MODE: 'single', // 'single', 'both', 'none'
OLED_MODE: true, // Black bg + bright colors

text

### Line Drift (Organic Bending)
LINE_DRIFT_ENABLED: false, // Enable gradual line bending
LINE_DRIFT_AMOUNT: 2, // Max angle change per frame (degrees)
LINE_DRIFT_FREQUENCY: 0.3, // Drift probability (0-1)

text

### Particle Effects
SPARKLER_ENABLED: true, // Particles at line tips
SPARK_SPAWN_RATE: 3, // Sparks per frame
SPARK_LIFETIME: 15, // Frames until disappear
CURSOR_SPARKS_ENABLED: true, // Cursor trail effect

text

### Animation Timing
RESET_AFTER_SECONDS: 60, // Auto-reset timer (0 = disabled)
FADE_OUT_SECONDS: 3, // Soft fade duration
HARD_RESET_EVERY: 3, // Full reset cycle count

text

## Color Customization

**Normal Mode Colors:**
FG_COLOR: , // Line color (black)
BG_COLOR: , // Background (white)
COLORS: [ // Sand/particle colors
, // Red
, // Green
// Add more RGB arrays...
]

text

**OLED Mode Colors** (auto-selected when `OLED_MODE = true`):
OLED_FG_COLOR: , // White lines
OLED_BG_COLOR: , // Black background
OLED_COLORS: [ // Vibrant glowing colors
, // Cyan
, // Magenta
// ...
]

text

## How It Works

### Algorithm Overview
1. **Initialization** - Start with random lines on empty canvas
2. **Growth** - Each line moves forward at constant speed
3. **Collision Detection** - Check grid for existing lines at new position
4. **Branching Logic**:
   - **Parallel lines** (< 5° difference) → pass through
   - **Intersecting lines** (> 5° difference) → collision → branch into 2 new lines
   - **Canvas edge** → branch into 2 new lines
5. **Rendering** - Draw line segment + sand particles + sparkles

### Collision Grid
- Canvas divided into pixel-sized grid
- Each cell stores the angle (0-360°) of any line passing through
- New lines check grid to detect nearby lines and their angles
- Value `10001` = empty space

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- Requires HTML5 Canvas support

## Credits

- Original **Substrate algorithm** by [Jared Tarbell](http://www.complexification.net/gallery/machines/substrate/)
- Enhanced with modern features: particle effects, line drift, multiple modes
- Developed with smooth animations and OLED optimization

## License

MIT License - Feel free to use and modify!

## Contributing

Pull requests welcome! Ideas for contributions:
- Additional branching patterns
- Color palette presets
- Export artwork as image/video
- Performance optimizations
- Mobile touch gestures

---

**Enjoy watching the organic patterns grow!** 🎨✨
