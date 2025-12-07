# Substrate HTML Wallpaper

*[🇩🇪 Deutsche Version](README.de.md)*

Generative art wallpaper for **KDE Plasma** featuring organic crack patterns with particle effects.

## Features

- Organic line growth with branching on collision
- Particle effects along lines (sparkler + sand gradients)
- Multiple themes (Default, OLED, Forest variants)
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

**Default:** `file:///home/USERNAME/.local/share/wallpapers/substrate/Substrate.html`  
**OLED:** `file:///home/USERNAME/.local/share/wallpapers/substrate/Substrate.html?config=default-oled.js`  
**Forest:** `file:///home/USERNAME/.local/share/wallpapers/substrate/Substrate.html?config=forest.js`

## Configuration

Open any config file in `config/` - all settings have inline documentation.

### Key Settings

```javascript
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

1. Copy `config/default.js` → `config/myconfig.js`
2. Edit settings
3. Load: `Substrate.html?config=myconfig.js`

## Performance Tips

For desktop wallpaper use:

```javascript
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
**Config issues:** Check syntax, file location in `config/`, console errors

## Credits

Original algorithm by [Jared Tarbell](http://www.complexification.net/gallery/machines/substrate/)
