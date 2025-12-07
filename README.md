# Substrate HTML Wallpaper

*[🇩🇪 Deutsche Version lesen](README.de.md)*

Generative art wallpaper for **KDE Plasma** featuring organic crack patterns with particle effects.

## Features

- **Organic Line Growth** - Lines grow and branch when colliding
- **Particle Effects** - Sparkler particles along lines with configurable glow
- **Sand Gradients** - Colorful particles along line edges (adjustable opacity)
- **Multiple Themes** - Default, OLED, Forest variants with custom color palettes
- **Performance Optimized** - Object pooling, batched rendering, FPS limiting, idle detection
- **Responsive** - Adapts to window resizing while preserving state
- **Configurable** - All settings adjustable via config files with inline documentation

## Installation for KDE Plasma

### 1. Install HTML Wallpaper Plugin

**Via System Settings:**
```
Right-click desktop → Configure Desktop and Wallpaper → Get New Plugins → Search "HTML Wallpaper" → Install
```

**Or via command line:**
```bash
kpackagetool5 --type=Plasma/Wallpaper --install com.github.uncommonsense.htmlwallpaper
```

### 2. Download Repository

```bash
mkdir -p ~/.local/share/wallpapers/substrate
cd ~/.local/share/wallpapers/substrate
# Copy all files from repository here
```

### 3. Configure Wallpaper

1. Right-click desktop → **Configure Desktop and Wallpaper**
2. **Wallpaper Type** → **HTML Wallpaper**
3. Set **Webpage URL** to:

**Default Theme:**
```
file:///home/YOUR_USERNAME/.local/share/wallpapers/substrate/Substrate.html
```

**OLED Theme:**
```
file:///home/YOUR_USERNAME/.local/share/wallpapers/substrate/Substrate.html?config=default-oled.js
```

**Forest Theme:**
```
file:///home/YOUR_USERNAME/.local/share/wallpapers/substrate/Substrate.html?config=forest.js
```

**Forest OLED:**
```
file:///home/YOUR_USERNAME/.local/share/wallpapers/substrate/Substrate.html?config=forest-oled.js
```

4. Click **Apply**

## Available Themes

- **default.js** - Classic white background, colorful lines
- **default-oled.js** - Black background, vibrant colors (30 FPS, higher sand opacity)
- **forest.js** - Warm cream background, natural greens and browns
- **forest-oled.js** - Black background, bright forest colors (30 FPS, higher sand opacity)

## Configuration

### File Structure

```
Substrate.html           - Main HTML file
js/
  main.js                - Animation loop
  crack.js               - Line drawing logic
  spark.js               - Particle system
  utils.js               - Helper functions
  config-validator.js    - Config validation
config/
  default.js             - Default theme
  default-oled.js        - OLED theme
  forest.js              - Forest theme
  forest-oled.js         - Forest OLED theme
```

### Loading Configs

Use URL parameters:

```
Substrate.html                        → default.js
Substrate.html?config=default-oled.js → default-oled.js
Substrate.html?config=forest.js       → forest.js
Substrate.html?config=myconfig.js     → custom config
```

### Key Settings

All config files contain **inline documentation**. Open any config file to see all available options with explanations.

**Most Important Settings:**

```javascript
// Performance
TARGET_FPS: 60,              // Lower = less CPU (30 recommended for wallpaper)
MAX_CRACKS: 100,             // Lower = better performance
GRAINS: 64,                  // Lower = faster (32-64 recommended)
ANTI_ALIASING: true,         // false = ~10% faster

// Visual
SAND_ALPHA: 0.1,             // Sand opacity (0.0-1.0, higher = more vibrant)
LINE_WIDTH: 1,               // Line thickness
CIRCLE_PERCENT: 40,          // Curved line probability

// Timing
COVERAGE_RESET_PERCENT: 10,  // Reset when X% covered
FADE_OUT_SECONDS: 3,         // Fade duration

// Colors
BG_COLOR: [255, 255, 255],   // Background RGB
COLORS: [...]                // Line/sand/spark palette
```

### Creating Custom Configs

1. Copy `config/default.js` → `config/myconfig.js`
2. Edit settings (all documented inline)
3. Load: `Substrate.html?config=myconfig.js`

**Config validator ensures safe fallbacks for invalid values.**

## Performance Tips

**For Wallpaper Use:**
```javascript
TARGET_FPS: 30,               // Limit framerate
MAX_CRACKS: 50-75,            // Reduce concurrent lines
GRAINS: 32-48,                // Lower particle count
ANTI_ALIASING: false,         // Disable for ~10% gain
CLICK_SPAWN_ENABLED: false,   // Disable interactions
CURSOR_SPARKS_ENABLED: false, // Disable cursor effects
```

**Already Optimized:**
- Object pooling for particles
- Batched rendering by color
- RAF stops when idle
- Sand grain batching
- Typed arrays for collision grid

## How It Works

1. **Start** - Spawn initial lines based on canvas size
2. **Grow** - Lines move forward each frame
3. **Collide** - Detect intersections via pixel grid
4. **Branch** - Create 2 new lines at collision points
5. **Render** - Draw lines + sand + sparks
6. **Reset** - Clear canvas when coverage threshold reached

**Collision Detection:**
- Grid stores line angle at each pixel
- Lines check grid ahead for collisions
- Parallel lines pass through (<5° difference)
- Intersecting lines branch (>5° difference)

## Troubleshooting

### Wallpaper Not Loading
- Use absolute path: `file:///home/username/...`
- Check permissions: `chmod 644 *.html *.js`
- Verify file structure matches above
- Check browser console (F12) for errors

### Performance Issues
- Lower `TARGET_FPS` to 30
- Reduce `MAX_CRACKS` to 50
- Lower `GRAINS` to 32
- Set `ANTI_ALIASING: false`
- Use OLED config (already optimized)

### Config Not Loading
- Check syntax: `?config=filename.js`
- File must be in `config/` folder
- Validator provides fallback defaults
- Check console for validation warnings

## Browser Compatibility

- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- Requires HTML5 Canvas support

## Credits

- Original **Substrate algorithm** by [Jared Tarbell](http://www.complexification.net/gallery/machines/substrate/)
- Performance optimizations and KDE integration by community

---

**Enjoy your living wallpaper!** 🎨✨