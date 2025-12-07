# Substrate HTML Wallpaper

*[🇬🇧 English version](README.md)*

Generative Kunst-Wallpaper für **KDE Plasma** mit organischen Rissmustern und Partikeleffekten.

## Features

- Organisches Linienwachstum mit Verzweigung bei Kollision
- Partikeleffekte entlang Linien (Wunderkerzen + Sand-Farbverläufe)
- Mehrere Themes (Default, OLED, Forest-Varianten)
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

**Default:** `file:///home/BENUTZERNAME/.local/share/wallpapers/substrate/Substrate.html`  
**OLED:** `file:///home/BENUTZERNAME/.local/share/wallpapers/substrate/Substrate.html?config=default-oled.js`  
**Forest:** `file:///home/BENUTZERNAME/.local/share/wallpapers/substrate/Substrate.html?config=forest.js`

## Konfiguration

Öffne eine Config-Datei in `config/` - alle Einstellungen haben Inline-Dokumentation (auf Englisch).

### Wichtige Einstellungen

```javascript
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

1. Kopiere `config/default.js` → `config/myconfig.js`
2. Einstellungen bearbeiten
3. Laden: `Substrate.html?config=myconfig.js`

## Performance-Tipps

Für Desktop-Wallpaper:

```javascript
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
**Config-Probleme:** Syntax prüfen, Datei-Ort in `config/`, Konsolen-Fehler

## Credits

Originaler Algorithmus von [Jared Tarbell](http://www.complexification.net/gallery/machines/substrate/)
