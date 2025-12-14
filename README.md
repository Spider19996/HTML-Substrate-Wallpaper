# Substrate HTML Wallpaper

*[🇩🇪 Deutsche Version](README.de.md)*

Generative art wallpaper for **KDE Plasma** featuring organic crack patterns with particle effects.

## Features

- Organic line growth with branching on collision
- **Variable line speeds** (each crack moves at different speed)
- Particle effects along lines (sparkler + sand gradients)
- **Theme rotation** - automatically switch themes on reset
- Multiple theme collections (bright/OLED)
- Performance optimized (object pooling, FPS limiting, idle detection)
- Fully configurable via config files

## Installation (KDE Plasma)

### 1. Install Plugin

```bash
kpackagetool5 --type=Plasma/Wallpaper --install com.github.uncommonsense.htmlwallpaper
```

Or: Right-click desktop → Configure → Get New Plugins → "HTML Wallpaper"

### 2. Download Files

```bash
mkdir -p ~/.local/share/wallpapers/substrate
cd ~/.local/share/wallpapers/substrate
# Copy repository files here
```

### 3. Set Wallpaper

Right-click desktop → Configure → Wallpaper Type: **HTML Wallpaper**

Set URL to (replace USERNAME):

**Default (single theme from bright collection):**  
`file:///home/USERNAME/.local/share/wallpapers/substrate/Substrate.html`

**Random bright themes (auto-rotation):**  
`file:///home/USERNAME/.local/share/wallpapers/substrate/Substrate.html?theme=bright`

**Random OLED themes (auto-rotation, OLED-friendly):**  
`file:///home/USERNAME/.local/share/wallpapers/substrate/Substrate.html?theme=oled`

**Specific theme (full path required):**  
`file:///home/USERNAME/.local/share/wallpapers/substrate/Substrate.html?theme=oled/default-oled.js`  
`file:///home/USERNAME/.local/share/wallpapers/substrate/Substrate.html?theme=bright/forest-bright.js`

# Theme Collections see config folder

## Configuration

Open any config file in `config/bright/` or `config/oled/` - all settings have inline documentation.

### Key Settings

```javascript
STEP_MIN: 0.1               // Minimum line speed (varied movement)
STEP_MAX: 1.5               // Maximum line speed
TARGET_FPS: 60              // Lower = less CPU (30 recommended)
MAX_CRACKS: 100             // Concurrent lines (50-75 for better performance)
GRAINS: 64                  // Sand particles (32-48 recommended)
SAND_ALPHA: 0.1             // Sand opacity (0.0-1.0)
LINE_WIDTH: 1               // Line thickness
CIRCLE_PERCENT: 40          // Curved line probability
BG_COLOR: [255, 255, 255]   // Background RGB
COLORS: [...]               // Line/particle palette
```

### Custom Config

1. Copy any config from `config/bright/` or `config/oled/`
2. Create: `config/bright/myconfig.js` or `config/oled/myconfig.js`
3. Edit settings
4. Add to theme collection in `config/*/themes.txt` to include in rotation, or load directly via:

   `Substrate.html?theme=bright/myconfig.js`

## URL Parameters

- `?theme=bright` - Auto-rotate through bright themes on each reset
- `?theme=oled` - Auto-rotate through OLED themes
- `?theme=bright/forest.js` - Load single specific theme (full path required, no rotation)

## Performance Tips

For desktop wallpaper use:

```javascript
STEP_MIN: 0.1
STEP_MAX: 1.0
TARGET_FPS: 30
MAX_CRACKS: 50-75
GRAINS: 32-48
ANTI_ALIASING: false
CLICK_SPAWN_ENABLED: false
CURSOR_SPARKS_ENABLED: false
```

## Troubleshooting

**Not loading:** Check absolute path, permissions (`chmod 644 *.html *.js`), console (F12)  
**Slow:** Lower FPS/MAX_CRACKS/GRAINS, disable anti-aliasing  
**Config issues:** Check syntax, file location in `config/bright/` or `config/oled/`, console errors  
**Theme rotation not working:** Ensure `js/theme-manager.js` and `config/*/themes.txt` exist and URL uses `?theme=` parameter

## Credits

Original algorithm by [Jared Tarbell](http://www.complexification.net/gallery/machines/substrate/)
