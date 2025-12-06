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
- **Responsive Resize** - Canvas adapts to window size changes while preserving animation state

### Visual Modes
- **OLED Mode** - Black background with vibrant glowing colors, optimized for OLED displays
- **Normal Mode** - White background with darker line colors (classic Substrate look)
- **Customizable Configs** - Load different configuration files via URL parameters
- **FPS Counter** - Optional on-screen FPS display with customizable position and color

### Performance Optimizations
- **FPS Limiting** - Cap framerate to reduce CPU/GPU usage (configurable or unlimited)
- **Object Pooling** - Efficient memory management for particle effects
- **Gradient Caching** - Pre-rendered glow effects for better performance
- **requestIdleCallback** - Non-critical updates run only when browser is idle
- **Config Validation** - Automatic validation and safe fallback values

### Interaction
- **Click to Spawn** - Click anywhere to create new crack lines (optional)
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
- **Error Handling** - Graceful fallback if config fails to load

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
```bash
mkdir -p ~/.local/share/wallpapers/substrate
cd ~/.local/share/wallpapers/substrate
# Copy all files from repository here
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
- Set `TARGET_FPS` to 30 or 60 (lower = less CPU usage)
- Reduce `MAX_CRACKS` to 50-75 for lower-end systems
- Disable `CURSOR_SPARKS_ENABLED` to reduce CPU usage
- Set `RESET_AFTER_SECONDS` to prevent memory buildup
- Lower `GRAINS` to 32 for faster rendering
- Use `config-oled.js` for better contrast on desktop

**Recommended Settings for Desktop Wallpaper:**
```javascript
TARGET_FPS: 30,               // Limit framerate for efficiency
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
- `Substrate.html` - Main HTML file
- `js/main.js` - Core animation loop
- `js/crack.js` - Line drawing logic
- `js/spark.js` - Particle system with object pooling
- `js/utils.js` - Helper functions
- `js/config-validator.js` - Config validation and safe defaults
- `config/config.js` - Normal mode configuration (white background)
- `config/config-oled.js` - OLED mode configuration (black background)

### Loading Different Configs

Use URL parameters to load alternative configurations:

```
Substrate.html                           → loads config.js (default)
Substrate.html?config=config-oled.js    → loads config-oled.js
Substrate.html?config=myconfig.js       → loads custom config
```

### Configuration Options

All configuration files include inline documentation. Edit `config/config.js` or `config/config-oled.js` to customize behavior:

#### Line Behavior
```javascript
STEP: 0.7,                    // Line speed (pixels per frame)
CRACKS_PER_100K_PIXELS: 1,    // Lines per 100k pixels (dynamic scaling)
MIN_INITIAL_CRACKS: 2,        // Minimum starting lines
MAX_INITIAL_CRACKS: 20,       // Maximum starting lines
MAX_CRACKS: 100,              // Maximum concurrent lines
CIRCLE_PERCENT: 40,           // Curved line probability (%)
BRANCH_MODE: 'perpendicular', // 'perpendicular', 'opposite', 'any'
```

#### Visual Effects
```javascript
LINE_WIDTH: 1,          // Crack line thickness
GRAINS: 64,             // Sand particles per line (0 = disabled)
SAND_MODE: 'both',      // 'one' (single side), 'both' (both sides), 'none' (disabled)
```

#### Line Drift (Organic Bending)
```javascript
LINE_DRIFT_ENABLED: false,    // Enable gradual line bending
LINE_DRIFT_AMOUNT: 2,         // Max angle change per frame (degrees, 0-45)
LINE_DRIFT_FREQUENCY: 0.3,    // Drift probability (0-1)
```

#### Particle Effects
```javascript
SPARKLER_ENABLED: true,       // Particles at line tips
SPARK_SPAWN_RATE: 3,          // Sparks per frame
SPARK_SPEED_MIN: 0.5,         // Minimum spark velocity
SPARK_SPEED_MAX: 2.5,         // Maximum spark velocity
SPARK_LIFETIME: 15,           // Frames until disappear
SPARK_SIZE: 1.3,              // Spark particle size
SPARK_GLOW: 2.0,              // Glow radius (0 = no glow)
CURSOR_SPARKS_ENABLED: false, // Cursor trail effect
CURSOR_SPARK_RATE: 2,         // Sparks per frame at cursor
```

#### Animation Timing
```javascript
RESET_AFTER_SECONDS: 60,      // Auto-reset timer (0 = disabled)
FADE_OUT_SECONDS: 3,          // Soft fade duration
HARD_RESET_EVERY: 3,          // Full reset cycle count (0 = never)
HARD_FADE_SECONDS: 2,         // Hard fade to black duration
HARD_FADE_IN_SECONDS: 2,      // Fade in duration after hard reset
```

#### FPS Settings
```javascript
FPS_COUNTER_ENABLED: false,   // Display FPS counter on screen
FPS_COUNTER_POSITION: 'top-left', // 'top-left' or 'top-right'
FPS_COUNTER_SIZE: 14,         // Font size in pixels
FPS_COUNTER_COLOR: [0, 0, 0], // RGB color [R, G, B]
TARGET_FPS: 60,               // Maximum framerate (0 = unlimited)
```

#### Mouse Interaction
```javascript
CLICK_SPAWN_ENABLED: false,   // Spawn line on click
CURSOR_SPARKS_ENABLED: false, // Cursor sparkle effect
CURSOR_SPARK_RATE: 2,         // Sparks per frame at cursor
```

#### Colors
```javascript
FG_COLOR: [0, 0, 0],          // Main line color [R, G, B]
BG_COLOR: [255, 255, 255],    // Background color [R, G, B]
COLORS: [                     // Sand/spark color palette (randomly selected)
    [255, 50, 50],   // Red
    [50, 255, 50],   // Green
    [50, 50, 255],   // Blue
    [255, 255, 0],   // Yellow
    [255, 0, 255],   // Magenta
    [0, 255, 255]    // Cyan
]
```

## Creating Custom Configs

1. Copy `config/config.js` to a new file (e.g., `config/config-custom.js`)
2. Modify settings as desired (inline comments explain each option)
3. Load via URL: `Substrate.html?config=config-custom.js`

**Config validation ensures:**
- Invalid values are replaced with safe defaults
- Range checks prevent crashes
- Console warnings for configuration issues
- Graceful fallback if config fails to load

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

### Performance Features
- **Object Pooling** - Reuses spark objects instead of creating/destroying (reduces GC pauses)
- **Gradient Caching** - Pre-renders glow effects once per color
- **FPS Limiting** - Precise frame timing to cap framerate
- **requestIdleCallback** - Non-critical updates during browser idle time
- **Optimized Loops** - Combined update/draw/cleanup passes

### Dynamic Scaling
- Initial line count: `(canvas_width × canvas_height) / 100000 × CRACKS_PER_100K_PIXELS`
- Clamped between `MIN_INITIAL_CRACKS` and `MAX_INITIAL_CRACKS`
- Automatically adjusts for different screen resolutions
- Window resize preserves animation state

### Collision Grid
- Canvas divided into pixel-sized grid
- Each cell stores the angle (0-360°) of any line passing through
- New lines check grid to detect nearby lines and their angles
- Value `10001` = empty space

## Troubleshooting

### Wallpaper Not Loading
- Ensure file path starts with `file://`
- Check file permissions: `chmod 644 Substrate.html config/*.js js/*.js`
- Try absolute path instead of `~` or relative paths
- Verify all files are in correct directory structure
- Check browser console (F12) for error messages

### Config Not Loading
- Check URL parameter syntax: `?config=config-oled.js`
- Ensure config file is in `config/` directory
- Check browser console for JavaScript errors (F12)
- Animation will run with safe defaults if config fails

### Performance Issues
- Set `TARGET_FPS` to 30 for better efficiency
- Lower `MAX_CRACKS` to 30-50
- Reduce `GRAINS` to 32 or set `SAND_MODE: 'none'`
- Disable `LINE_DRIFT_ENABLED`
- Lower `CRACKS_PER_100K_PIXELS` to 0.5
- Reduce `SPARK_SPAWN_RATE` to 1-2

### FPS Counter Not Showing
- Set `FPS_COUNTER_ENABLED: true` in config
- Adjust `FPS_COUNTER_COLOR` to contrast with background
- Try different `FPS_COUNTER_POSITION`

## Browser Compatibility

- ✅ Chrome/Chromium 90+
- ✅ Vivaldi
- ✅ Firefox 88+
- ✅ Edge 90+
- Requires HTML5 Canvas support
- requestIdleCallback support (optional, falls back to setTimeout)

## Credits

- Original **Substrate algorithm** by [Jared Tarbell](http://www.complexification.net/gallery/machines/substrate/)
- Performance optimizations and features by the community

---

**Enjoy your living desktop wallpaper!** 🎨✨
