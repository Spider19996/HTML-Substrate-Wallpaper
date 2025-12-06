# Substrate Visualizer

An interactive generative art visualization optimized for **KDE Plasma HTML Wallpapers**. Watch organic crack patterns grow and branch across your desktop with particle effects and smooth animations.

## Features

### Core Visualization
- **Organic Line Growth** - Lines (cracks) grow across the canvas and branch when colliding
- **Smart Collision Detection** - Lines detect intersections and create new branches at collision points
- **Curved Lines** - Configurable probability for curved/circular line segments
- **Particle Effects** - Sparkler-style particles at line tips with gravity simulation
- **Sand Gradient** - Colorful gradient particles along line edges (configurable: single side, both sides, or disabled)
- **Dynamic Scaling** - Automatically adjusts line count based on canvas size

### Visual Modes
- **OLED Mode** - Black background with vibrant glowing colors, optimized for OLED displays
- **Normal Mode** - White background with darker line colors (classic Substrate look)
- **Customizable Configs** - Load different configuration files via URL parameters

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

## Installation for KDE Plasma

### Plasma Wallpaper Plugin (Recommended)

1. Install **HTML Wallpaper** plugin from KDE Store:

**Via System Settings:**
```
Right-click desktop → Configure Desktop and Wallpaper → Get New Plugins → Search "HTML Wallpaper" → Install
```

**Or via command line:**
```
kpackagetool5 --type=Plasma/Wallpaper --install com.github.uncommonsense.htmlwallpaper
```

2. Download files to a location of your choice:
```
mkdir -p ~/.local/share/wallpapers/substrate
cd ~/.local/share/wallpapers/substrate
# Copy Substrate.html, config.js, and config-oled.js here
```

3. Right-click on desktop → **Configure Desktop and Wallpaper**

4. Select **Wallpaper Type** → **HTML Wallpaper**

5. Set **Webpage URL** to:
```
file:///home/YOUR_USERNAME/.local/share/wallpapers/substrate/Substrate.html
```

6. For OLED mode:
```
file:///home/YOUR_USERNAME/.local/share/wallpapers/substrate/Substrate.html?config=config-oled.js
```

7. Click **Apply**

### Performance Tips for KDE

**For Best Performance:**
- Reduce `MAX_CRACKS` to 50-75 for lower-end systems
- Disable `CURSOR_SPARKS_ENABLED` to reduce CPU usage
- Set `RESET_AFTER_SECONDS` to prevent memory buildup
- Use `config-oled.js` for better contrast on desktop

**Recommended Settings for Desktop Wallpaper:**
```
STEP: 0.5,                    // Slower, more zen-like
CRACKS_PER_100K_PIXELS: 0.5,  // Lower density
MIN_INITIAL_CRACKS: 2,        // Start minimal
MAX_INITIAL_CRACKS: 15,       // Limit for performance
MAX_CRACKS: 60,               // Limit concurrent lines
RESET_AFTER_SECONDS: 120,     // Reset every 2 minutes
CURSOR_SPARKS_ENABLED: false, // Disable for wallpaper use
CLICK_SPAWN_ENABLED: false,   // Disable for wallpaper use
```

## Configuration

### File Structure

The project consists of:
- `Substrate.html` - Main visualization engine
- `config.js` - Normal mode configuration (white background)
- `config-oled.js` - OLED mode configuration (black background)

### Loading Different Configs

Use URL parameters to load alternative configurations:

```
Substrate.html                           → loads config.js (default)
Substrate.html?config=config-oled.js    → loads config-oled.js
Substrate.html?config=myconfig.js       → loads custom config
```

### Configuration Options

Edit `config.js` or `config-oled.js` to customize behavior:

#### Line Behavior
```
STEP: 0.7,                    // Line speed (pixels per frame)
CRACKS_PER_100K_PIXELS: 1,    // Lines per 100k pixels (dynamic scaling)
MIN_INITIAL_CRACKS: 2,        // Minimum starting lines (set equal to max for fixed count)
MAX_INITIAL_CRACKS: 20,       // Maximum starting lines
MAX_CRACKS: 100,              // Maximum concurrent lines
CIRCLE_PERCENT: 40,           // Curved line probability (%)
BRANCH_MODE: 'perpendicular', // 'perpendicular', 'opposite', 'any'
```

#### Visual Effects
```
LINE_WIDTH: 1,          // Crack line thickness
GRAINS: 64,             // Sand particles per line
SAND_MODE: 'both',      // 'single', 'both', 'none'
```

#### Line Drift (Organic Bending)
```
LINE_DRIFT_ENABLED: false,    // Enable gradual line bending
LINE_DRIFT_AMOUNT: 2,         // Max angle change per frame (degrees)
LINE_DRIFT_FREQUENCY: 0.3,    // Drift probability (0-1)
```

#### Particle Effects
```
SPARKLER_ENABLED: true,       // Particles at line tips
SPARK_SPAWN_RATE: 3,          // Sparks per frame
SPARK_LIFETIME: 15,           // Frames until disappear
SPARK_SIZE: 1.3,              // Spark particle size
SPARK_GLOW: 2.0,              // Glow radius
CURSOR_SPARKS_ENABLED: true,  // Cursor trail effect
CURSOR_SPARK_RATE: 2,         // Sparks per frame at cursor
```

#### Animation Timing
```
RESET_AFTER_SECONDS: 60,      // Auto-reset timer (0 = disabled)
FADE_OUT_SECONDS: 3,          // Soft fade duration
HARD_RESET_EVERY: 3,          // Full reset cycle count
HARD_FADE_SECONDS: 2,         // Hard fade to black duration
HARD_FADE_IN_SECONDS: 2,      // Fade in duration after hard reset
```

#### Mouse Interaction
```
CLICK_SPAWN_ENABLED: true,     // Spawn line on click
CURSOR_SPARKS_ENABLED: true,   // Cursor sparkle effect
CURSOR_SPARK_RATE: 2,          // Sparks per frame at cursor
```

## Color Customization

**Normal Mode (config.js):**
```
FG_COLOR: ,          // Line color (black)
BG_COLOR: ,    // Background (white)
COLORS: [                      // Sand/particle colors
    ,   // Red
    ,   // Green
    ,   // Blue
    ,   // Yellow
    ,   // Magenta
        // Cyan
]
```

**OLED Mode (config-oled.js):**
```
FG_COLOR: ,    // White lines
BG_COLOR: ,          // Black background
COLORS: [                      // Vibrant glowing colors
    ,     // Cyan
    ,     // Magenta
    ,     // Yellow
    ,     // Green-Cyan
    ,     // Orange
          // Purple
]
```

## Creating Custom Configs

1. Copy `config.js` to a new file (e.g., `config-custom.js`)
2. Modify settings as desired
3. Load via URL: `Substrate.html?config=config-custom.js`

**Example custom configs:**
- `config-minimal.js` - Minimal lines, no particles
- `config-chaos.js` - High density, fast movement
- `config-zen.js` - Slow, peaceful animation

## How It Works

### Algorithm Overview
1. **Initialization** - Start with lines based on canvas size (dynamic scaling)
2. **Growth** - Each line moves forward at constant speed
3. **Collision Detection** - Check grid for existing lines at new position
4. **Branching Logic**:
   - **Parallel lines** (< 5° difference) → pass through
   - **Intersecting lines** (> 5° difference) → collision → branch into 2 new lines
   - **Canvas edge** → branch into 2 new lines
5. **Rendering** - Draw line segment + sand particles + sparkles

### Dynamic Scaling
- Initial line count: `(canvas_width × canvas_height) / 100000 × CRACKS_PER_100K_PIXELS`
- Clamped between `MIN_INITIAL_CRACKS` and `MAX_INITIAL_CRACKS`
- Automatically adjusts for different screen resolutions

### Collision Grid
- Canvas divided into pixel-sized grid
- Each cell stores the angle (0-360°) of any line passing through
- New lines check grid to detect nearby lines and their angles
- Value `10001` = empty space

## Troubleshooting

### Wallpaper Not Loading
- Ensure file path starts with `file://`
- Check file permissions: `chmod 644 Substrate.html config*.js`
- Try absolute path instead of `~` or relative paths
- Verify config file exists in same directory

### Config Not Loading
- Check URL parameter syntax: `?config=filename.js`
- Ensure config file is in same directory as Substrate.html
- Check browser console for JavaScript errors (F12)

### Performance Issues
- Lower `MAX_CRACKS` to 30-50
- Reduce `GRAINS` to 32
- Disable `LINE_DRIFT_ENABLED`
- Set `SAND_MODE: 'none'`
- Lower `CRACKS_PER_100K_PIXELS` to 0.5

## Browser Compatibility

- ✅ Chrome/Chromium 90+
- ✅ Vivaldi
- ✅ Firefox 88+
- Requires HTML5 Canvas support

## Credits

- Original **Substrate algorithm** by [Jared Tarbell](http://www.complexification.net/gallery/machines/substrate/)

---

**Enjoy your living desktop wallpaper!** 🎨✨