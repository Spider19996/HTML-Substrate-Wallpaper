# Substrate HTML Wallpaper

*[🇬🇧 Read English version](README.md)*

Eine interaktive generative Kunst-Visualisierung, optimiert für **KDE Plasma HTML-Hintergrundbilder**. Beobachte organische Rissmuster, die über deinen Desktop wachsen und sich verzweigen, mit Partikeleffekten und fließenden Animationen.

## Features

### Kern-Visualisierung
- **Organisches Linienwachstum** - Linien (Risse) wachsen über die Leinwand und verzweigen sich bei Kollisionen
- **Intelligente Kollisionserkennung** - Linien erkennen Schnittpunkte und erzeugen neue Verzweigungen
- **Gekrümmte Linien** - Konfigurierbare Wahrscheinlichkeit für gekrümmte/kreisförmige Liniensegmente
- **Partikeleffekte** - Wunderkerzen-artige Partikel an Linienspitzen mit Gravitationssimulation
- **Sand-Farbverlauf** - Farbige Verlaufspartikel entlang der Linienkanten (konfigurierbar: einseitig, beidseitig oder deaktiviert)
- **Dynamische Skalierung** - Passt Linienanzahl automatisch an Leinwandgröße an
- **Responsive Größenanpassung** - Leinwand passt sich Fenstergrößenänderungen an und behält dabei den Animationsstatus bei

### Visuelle Modi
- **OLED-Modus** - Schwarzer Hintergrund mit leuchtenden Farben, optimiert für OLED-Displays
- **Normal-Modus** - Weißer Hintergrund mit dunkleren Linienfarben (klassisches Substrate-Design)
- **Anpassbare Configs** - Lade verschiedene Konfigurationsdateien über URL-Parameter
- **FPS-Zähler** - Optional sichtbare FPS-Anzeige mit anpassbarer Position und Farbe

### Performance-Optimierungen
- **FPS-Begrenzung** - Begrenze die Bildrate um CPU/GPU-Auslastung zu reduzieren (konfigurierbar oder unbegrenzt)
- **Object Pooling** - Effiziente Speicherverwaltung für Partikeleffekte
- **Gradient-Caching** - Vorgerenderte Leuchteffekte für bessere Performance
- **requestIdleCallback** - Nicht-kritische Updates laufen nur wenn Browser Zeit hat
- **Config-Validierung** - Automatische Validierung und sichere Fallback-Werte

### Interaktion
- **Klick zum Spawnen** - Klicke irgendwo um neue Risslinien zu erstellen (optional)
- **Cursor-Funkeln** - Optionaler Partikeleffekt der deinem Mauszeiger folgt
- **Responsive Leinwand** - Passt sich automatisch Fenstergrößenänderungen an und behält das Kunstwerk bei

### Erweiterte Features
- **Verzweigungsmodi**:
  - `perpendicular` - Linien verzweigen bei ±90° (klassisches Substrate)
  - `opposite` - Linien können bei ±90° oder ±180° verzweigen (ermöglicht U-Turns)
  - `any` - Linien verzweigen in jede Richtung (0-360°)
- **Linien-Drift** - Linien können sich während des Zeichnens allmählich biegen für organischere Formen
- **Auto-Reset** - Konfigurierbarer Timer für automatischen Canvas-Reset mit sanften Überblendungen
- **Hard-Reset-Zyklen** - Vollständiger Fade-to-Black-Reset nach X Soft-Resets
- **Fehlerbehandlung** - Sanfter Fallback wenn Config nicht geladen werden kann

## Installation für KDE Plasma

### Plasma Wallpaper Plugin (Empfohlen)

1. Installiere das **HTML Wallpaper** Plugin aus dem KDE Store:

**Über Systemeinstellungen:**
```
Rechtsklick auf Desktop → Hintergrund konfigurieren → Neue Plugins holen → Suche "HTML Wallpaper" → Installieren
```

**Oder über Kommandozeile:**
```
kpackagetool5 --type=Plasma/Wallpaper --install com.github.uncommonsense.htmlwallpaper
```

2. Lade die Dateien in ein Verzeichnis deiner Wahl:
```bash
mkdir -p ~/.local/share/wallpapers/substrate
cd ~/.local/share/wallpapers/substrate
# Kopiere alle Dateien aus dem Repository hierher
```

3. Rechtsklick auf Desktop → **Hintergrund konfigurieren**

4. Wähle **Hintergrundtyp** → **HTML Wallpaper**

5. Setze **Webseiten-URL** auf:
```
file:///home/DEIN_BENUTZERNAME/.local/share/wallpapers/substrate/Substrate.html
```

6. Für OLED-Modus:
```
file:///home/DEIN_BENUTZERNAME/.local/share/wallpapers/substrate/Substrate.html?config=config-oled.js
```

7. Klicke **Anwenden**

### Performance-Tipps für KDE

**Für beste Performance:**
- Setze `TARGET_FPS` auf 30 oder 60 (niedriger = weniger CPU-Auslastung)
- Reduziere `MAX_CRACKS` auf 50-75 für schwächere Systeme
- Deaktiviere `CURSOR_SPARKS_ENABLED` um CPU-Auslastung zu reduzieren
- Setze `RESET_AFTER_SECONDS` um Speicheransammlung zu verhindern
- Senke `GRAINS` auf 32 für schnelleres Rendering
- Nutze `config-oled.js` für besseren Kontrast auf dem Desktop

**Empfohlene Einstellungen für Desktop-Hintergrund:**
```javascript
TARGET_FPS: 30,               // Begrenze Bildrate für Effizienz
STEP: 0.5,                    // Langsamer, zen-artiger
CRACKS_PER_100K_PIXELS: 0.5,  // Geringere Dichte
MIN_INITIAL_CRACKS: 2,        // Minimal starten
MAX_INITIAL_CRACKS: 15,       // Limit für Performance
MAX_CRACKS: 60,               // Begrenze gleichzeitige Linien
RESET_AFTER_SECONDS: 120,     // Reset alle 2 Minuten
CURSOR_SPARKS_ENABLED: false, // Für Hintergrund deaktivieren
CLICK_SPAWN_ENABLED: false,   // Für Hintergrund deaktivieren
```

## Konfiguration

### Dateistruktur

Das Projekt besteht aus:
- `Substrate.html` - Haupt-HTML-Datei
- `js/main.js` - Kern-Animationsschleife
- `js/crack.js` - Linienzeichen-Logik
- `js/spark.js` - Partikelsystem mit Object Pooling
- `js/utils.js` - Hilfsfunktionen
- `js/config-validator.js` - Config-Validierung und sichere Defaults
- `config/config.js` - Normal-Modus-Konfiguration (weißer Hintergrund)
- `config/config-oled.js` - OLED-Modus-Konfiguration (schwarzer Hintergrund)

### Verschiedene Configs laden

Nutze URL-Parameter um alternative Konfigurationen zu laden:

```
Substrate.html                           → lädt config.js (Standard)
Substrate.html?config=config-oled.js    → lädt config-oled.js
Substrate.html?config=meinconfig.js     → lädt eigene Config
```

### Konfigurationsoptionen

Alle Konfigurationsdateien enthalten Inline-Dokumentation auf Englisch. Bearbeite `config/config.js` oder `config/config-oled.js` um das Verhalten anzupassen:

#### Linienverhalten
```javascript
STEP: 0.7,                    // Liniengeschwindigkeit (Pixel pro Frame)
CRACKS_PER_100K_PIXELS: 1,    // Linien pro 100k Pixel (dynamische Skalierung)
MIN_INITIAL_CRACKS: 2,        // Minimum Startlinien
MAX_INITIAL_CRACKS: 20,       // Maximum Startlinien
MAX_CRACKS: 100,              // Maximum gleichzeitige Linien
CIRCLE_PERCENT: 40,           // Wahrscheinlichkeit für gekrümmte Linien (%)
BRANCH_MODE: 'perpendicular', // 'perpendicular', 'opposite', 'any'
```

#### Visuelle Effekte
```javascript
LINE_WIDTH: 1,          // Risslinienstärke
GRAINS: 64,             // Sandpartikel pro Linie (0 = deaktiviert)
SAND_MODE: 'both',      // 'one' (einseitig), 'both' (beidseitig), 'none' (deaktiviert)
```

#### Linien-Drift (Organisches Biegen)
```javascript
LINE_DRIFT_ENABLED: false,    // Aktiviere allmähliches Linienbiegen
LINE_DRIFT_AMOUNT: 2,         // Max. Winkeländerung pro Frame (Grad, 0-45)
LINE_DRIFT_FREQUENCY: 0.3,    // Drift-Wahrscheinlichkeit (0-1)
```

#### Partikeleffekte
```javascript
SPARKLER_ENABLED: true,       // Partikel an Linienspitzen
SPARK_SPAWN_RATE: 3,          // Funken pro Frame
SPARK_SPEED_MIN: 0.5,         // Minimale Funkengeschwindigkeit
SPARK_SPEED_MAX: 2.5,         // Maximale Funkengeschwindigkeit
SPARK_LIFETIME: 15,           // Frames bis zum Verschwinden
SPARK_SIZE: 1.3,              // Funkenpartikelgröße
SPARK_GLOW: 2.0,              // Leuchtradius (0 = kein Leuchten)
CURSOR_SPARKS_ENABLED: false, // Cursor-Schweif-Effekt
CURSOR_SPARK_RATE: 2,         // Funken pro Frame am Cursor
```

#### Animations-Timing
```javascript
RESET_AFTER_SECONDS: 60,      // Auto-Reset-Timer (0 = deaktiviert)
FADE_OUT_SECONDS: 3,          // Soft-Fade-Dauer
HARD_RESET_EVERY: 3,          // Vollständiger Reset-Zyklus-Zähler (0 = nie)
HARD_FADE_SECONDS: 2,         // Hard-Fade-to-Black-Dauer
HARD_FADE_IN_SECONDS: 2,      // Fade-In-Dauer nach Hard-Reset
```

#### FPS-Einstellungen
```javascript
FPS_COUNTER_ENABLED: false,   // Zeige FPS-Zähler auf Bildschirm
FPS_COUNTER_POSITION: 'top-left', // 'top-left' oder 'top-right'
FPS_COUNTER_SIZE: 14,         // Schriftgröße in Pixeln
FPS_COUNTER_COLOR: [0, 0, 0], // RGB-Farbe [R, G, B]
TARGET_FPS: 60,               // Maximale Bildrate (0 = unbegrenzt)
```

#### Maus-Interaktion
```javascript
CLICK_SPAWN_ENABLED: false,   // Spawne Linie bei Klick
CURSOR_SPARKS_ENABLED: false, // Cursor-Funkel-Effekt
CURSOR_SPARK_RATE: 2,         // Funken pro Frame am Cursor
```

#### Farben
```javascript
FG_COLOR: [0, 0, 0],          // Hauptlinienfarbe [R, G, B]
BG_COLOR: [255, 255, 255],    // Hintergrundfarbe [R, G, B]
COLORS: [                     // Sand/Funken-Farbpalette (zufällig ausgewählt)
    [255, 50, 50],   // Rot
    [50, 255, 50],   // Grün
    [50, 50, 255],   // Blau
    [255, 255, 0],   // Gelb
    [255, 0, 255],   // Magenta
    [0, 255, 255]    // Cyan
]
```

## Eigene Configs erstellen

1. Kopiere `config/config.js` in eine neue Datei (z.B. `config/config-custom.js`)
2. Passe die Einstellungen nach Wunsch an (Inline-Kommentare erklären jede Option)
3. Lade über URL: `Substrate.html?config=config-custom.js`

**Config-Validierung stellt sicher:**
- Ungültige Werte werden durch sichere Defaults ersetzt
- Bereichsprüfungen verhindern Abstürze
- Konsolen-Warnungen bei Konfigurationsproblemen
- Sanfter Fallback wenn Config nicht geladen werden kann

## Wie es funktioniert

### Algorithmus-Übersicht
1. **Initialisierung** - Starte mit Linien basierend auf Leinwandgröße (dynamische Skalierung)
2. **Wachstum** - Jede Linie bewegt sich mit konstanter Geschwindigkeit vorwärts
3. **Kollisionserkennung** - Prüfe Grid auf existierende Linien an neuer Position
4. **Verzweigungslogik**:
   - **Parallele Linien** (< 5° Unterschied) → durchlaufen
   - **Sich schneidende Linien** (> 5° Unterschied) → Kollision → verzweige in 2 neue Linien
   - **Leinwandrand** → verzweige in 2 neue Linien
5. **Rendering** - Zeichne Liniensegment + Sandpartikel + Funken

### Performance-Features
- **Object Pooling** - Wiederverwendet Funkenobjekte statt Erstellen/Zerstören (reduziert GC-Pausen)
- **Gradient-Caching** - Rendert Leuchteffekte einmal pro Farbe vor
- **FPS-Begrenzung** - Präzises Frame-Timing um Bildrate zu begrenzen
- **requestIdleCallback** - Nicht-kritische Updates während Browser-Leerlaufzeit
- **Optimierte Loops** - Kombinierte Update/Draw/Cleanup-Durchläufe

### Dynamische Skalierung
- Initiale Linienanzahl: `(canvas_breite × canvas_höhe) / 100000 × CRACKS_PER_100K_PIXELS`
- Begrenzt zwischen `MIN_INITIAL_CRACKS` und `MAX_INITIAL_CRACKS`
- Passt sich automatisch an verschiedene Bildschirmauflösungen an
- Fenstergrößenänderung bewahrt Animationsstatus

### Kollisions-Grid
- Leinwand in pixelgroßes Raster unterteilt
- Jede Zelle speichert den Winkel (0-360°) jeder durchlaufenden Linie
- Neue Linien prüfen Grid um nahe Linien und deren Winkel zu erkennen
- Wert `10001` = leerer Raum

## Fehlerbehebung

### Hintergrundbild lädt nicht
- Stelle sicher dass Dateipfad mit `file://` beginnt
- Prüfe Dateiberechtigungen: `chmod 644 Substrate.html config/*.js js/*.js`
- Versuche absoluten Pfad statt `~` oder relativen Pfaden
- Verifiziere dass alle Dateien in korrekter Verzeichnisstruktur sind
- Prüfe Browser-Konsole (F12) auf Fehlermeldungen

### Config lädt nicht
- Prüfe URL-Parameter-Syntax: `?config=config-oled.js`
- Stelle sicher dass Config-Datei im `config/` Verzeichnis ist
- Prüfe Browser-Konsole auf JavaScript-Fehler (F12)
- Animation läuft mit sicheren Defaults wenn Config fehlschlägt

### Performance-Probleme
- Setze `TARGET_FPS` auf 30 für bessere Effizienz
- Senke `MAX_CRACKS` auf 30-50
- Reduziere `GRAINS` auf 32 oder setze `SAND_MODE: 'none'`
- Deaktiviere `LINE_DRIFT_ENABLED`
- Senke `CRACKS_PER_100K_PIXELS` auf 0.5
- Reduziere `SPARK_SPAWN_RATE` auf 1-2

### FPS-Zähler wird nicht angezeigt
- Setze `FPS_COUNTER_ENABLED: true` in Config
- Passe `FPS_COUNTER_COLOR` für Kontrast zum Hintergrund an
- Probiere andere `FPS_COUNTER_POSITION`

## Browser-Kompatibilität

- ✅ Chrome/Chromium 90+
- ✅ Vivaldi
- ✅ Firefox 88+
- ✅ Edge 90+
- Benötigt HTML5 Canvas-Unterstützung
- requestIdleCallback-Unterstützung (optional, fällt zurück auf setTimeout)

## Credits

- Original **Substrate-Algorithmus** von [Jared Tarbell](http://www.complexification.net/gallery/machines/substrate/)
- Performance-Optimierungen und Features von der Community

---

**Viel Spaß mit deinem lebenden Desktop-Hintergrundbild!** 🎨✨
