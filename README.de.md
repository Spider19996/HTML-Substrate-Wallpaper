# Substrate HTML Wallpaper

*[🇬🇧 English version](README.md)*

Generative Kunst-Wallpaper für **KDE Plasma** mit organischen Rissmustern und Partikeleffekten.

## Features

- Organisches Linienwachstum mit Verzweigung bei Kollision
- **Variable Liniengeschwindigkeiten** (jede Linie bewegt sich unterschiedlich schnell)
- Partikeleffekte entlang Linien (Wunderkerzen + Sand-Farbverläufe)
- **Theme-Rotation** - automatischer Themenwechsel bei Reset
- Mehrere Theme-Sammlungen (hell/OLED)
- Performance-optimiert (Object Pooling, FPS-Limit, Idle-Detection)
- Voll konfigurierbar über Config-Dateien

## Installation (KDE Plasma)

### 1. Plugin installieren

```bash
kpackagetool5 --type=Plasma/Wallpaper --install com.github.uncommonsense.htmlwallpaper
```

Oder: Rechtsklick Desktop → Konfigurieren → Neue Plugins holen → "HTML Wallpaper"

### 2. Dateien herunterladen

```bash
mkdir -p ~/.local/share/wallpapers/substrate
cd ~/.local/share/wallpapers/substrate
# Repository-Dateien hierher kopieren
```

### 3. Wallpaper setzen

Rechtsklick Desktop → Konfigurieren → Hintergrundtyp: **HTML Wallpaper**

URL setzen (BENUTZERNAME ersetzen):

**Standard (einzelnes Theme aus bright-Sammlung):**  
`file:///home/BENUTZERNAME/.local/share/wallpapers/substrate/Substrate.html`

**Zufällige helle Themes (Auto-Rotation):**  
`file:///home/BENUTZERNAME/.local/share/wallpapers/substrate/Substrate.html?theme=bright`

**Zufällige dunkle/OLED-Themes (Auto-Rotation):**  
`file:///home/BENUTZERNAME/.local/share/wallpapers/substrate/Substrate.html?theme=oled`

**Spezifisches Theme (voller Pfad erforderlich):**  
`file:///home/BENUTZERNAME/.local/share/wallpapers/substrate/Substrate.html?theme=oled/default-oled.js`  
`file:///home/BENUTZERNAME/.local/share/wallpapers/substrate/Substrate.html?theme=bright/forest.js`

## Theme-Sammlungen

### Helle Themes (`config/bright/`)
- `default.js` - Bunte lebendige Linien auf weißem Hintergrund
- `forest.js` - Erdtöne mit organischer Anmutung
- `white-and-black.js` - Minimalistisch monochrom (schwarz auf weiß)

### Dunkle/OLED-Themes (`config/oled/`)
- `default-oled.js` - Bunte Linien auf reinem Schwarz (OLED-optimiert)
- `forest-oled.js` - Wald-Erdtöne auf Schwarz
- `black-and-white.js` - Weiße Linien auf schwarzem Hintergrund

## Konfiguration

Öffne eine Config-Datei in `config/bright/` oder `config/oled/` - alle Einstellungen haben Inline-Dokumentation (auf Englisch).

### Wichtige Einstellungen

```javascript
STEP_MIN: 0.1               // Minimale Liniengeschwindigkeit (variierte Bewegung)
STEP_MAX: 1.5               // Maximale Liniengeschwindigkeit
TARGET_FPS: 60              // Niedriger = weniger CPU (30 empfohlen)
MAX_CRACKS: 100             // Gleichzeitige Linien (50-75 für bessere Performance)
GRAINS: 64                  // Sand-Partikel (32-48 empfohlen)
SAND_ALPHA: 0.1             // Sand-Deckkraft (0.0-1.0)
LINE_WIDTH: 1               // Linienstärke
CIRCLE_PERCENT: 40          // Wahrscheinlichkeit für gekrümmte Linien
BG_COLOR: [255, 255, 255]   // Hintergrund-RGB
COLORS: [...]               // Linien-/Partikel-Palette
```

### Eigene Config

1. Kopiere eine Config aus `config/bright/` oder `config/oled/`
2. Erstelle: `config/bright/myconfig.js` oder `config/oled/myconfig.js`
3. Einstellungen bearbeiten
4. Zur Theme-Sammlung in `config/*/themes.txt` hinzufügen, um es in die Rotation aufzunehmen, oder direkt laden über:

   `Substrate.html?theme=bright/myconfig.js`

## URL-Parameter

- `?theme=bright` - Auto-Rotation durch helle Themes bei jedem Reset
- `?theme=oled` - Auto-Rotation durch dunkle/OLED-Themes
- `?theme=bright/forest.js` - Einzelnes spezifisches Theme laden (voller Pfad erforderlich, keine Rotation)

## Performance-Tipps

Für Desktop-Wallpaper:

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

## Fehlerbehebung

**Lädt nicht:** Prüfe absoluten Pfad, Berechtigungen (`chmod 644 *.html *.js`), Konsole (F12)  
**Langsam:** FPS/MAX_CRACKS/GRAINS senken, Anti-Aliasing deaktivieren  
**Config-Probleme:** Syntax prüfen, Datei-Ort in `config/bright/` oder `config/oled/`, Konsolen-Fehler  
**Theme-Rotation funktioniert nicht:** Stelle sicher, dass `js/theme-manager.js` und `config/*/themes.txt` existieren und die URL den `?theme=` Parameter nutzt

## Credits

Originaler Algorithmus von [Jared Tarbell](http://www.complexification.net/gallery/machines/substrate/)
