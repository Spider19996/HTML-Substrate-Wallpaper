/**
 * Theme Manager for Substrate Wallpaper
 * Handles dynamic theme loading and rotation between resets
 */

const ThemeManager = {
    collections: {}, // Loaded from themes.txt files
    currentTheme: null,
    rotationMode: null, // null, 'bright', 'dark'
    loadedThemes: new Map(), // Cache loaded theme configs
    onThemeChange: null, // Callback when theme changes
    initialized: false,
    
    /**
     * Load theme collections from themes.txt files in each config folder
     */
    loadCollections: function() {
        const folders = ['bright', 'dark'];
        const promises = folders.map(folder => 
            fetch(`config/${folder}/themes.txt`)
                .then(response => {
                    if (!response.ok) {
                        console.warn(`No themes.txt found in config/${folder}/`);
                        return [];
                    }
                    return response.text();
                })
                .then(text => {
                    // Parse text file: one filename per line, skip comments and empty lines
                    const themes = text
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line && !line.startsWith('#'))
                        .map(filename => `config/${folder}/${filename}`);
                    
                    if (themes.length > 0) {
                        this.collections[folder] = themes;
                        console.log(`Loaded ${themes.length} themes from ${folder}/themes.txt`);
                    }
                    return themes;
                })
                .catch(error => {
                    console.warn(`Failed to load themes from ${folder}:`, error);
                    return [];
                })
        );
        
        return Promise.all(promises).then(() => {
            // Fallback if no collections loaded
            if (Object.keys(this.collections).length === 0) {
                console.warn('No theme collections loaded, using fallback');
                this.collections = {
                    bright: [
                        'config/bright/default.js',
                        'config/bright/forest.js',
                        'config/bright/white-and-black.js'
                    ],
                    dark: [
                        'config/dark/default-oled.js',
                        'config/dark/forest-oled.js',
                        'config/dark/black-and-white.js'
                    ]
                };
            }
            
            this.initialized = true;
            return this.collections;
        });
    },
    
    /**
     * Initialize theme manager from URL parameters
     * Examples:
     *   ?theme=random-bright - Rotate through bright themes
     *   ?theme=random-dark - Rotate through dark themes
     *   ?theme=forest - Load specific theme (legacy mode)
     */
    init: function(onThemeChangeCallback) {
        this.onThemeChange = onThemeChangeCallback;
        
        return this.loadCollections().then(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const themeParam = urlParams.get('theme');
            
            if (themeParam === 'random-bright') {
                this.rotationMode = 'bright';
                return this.loadRandomTheme('bright');
            } else if (themeParam === 'random-dark') {
                this.rotationMode = 'dark';
                return this.loadRandomTheme('dark');
            } else if (themeParam) {
                // Legacy single theme mode
                this.rotationMode = null;
                return this.loadSpecificTheme(themeParam);
            }
            
            // Default: no rotation, use whatever CONFIG is loaded in HTML
            this.rotationMode = null;
            return Promise.resolve(window.CONFIG || {});
        });
    },
    
    /**
     * Load a random theme from specified collection
     */
    loadRandomTheme: function(collection) {
        const themes = this.collections[collection];
        if (!themes || themes.length === 0) {
            console.error(`No themes found in collection: ${collection}`);
            return Promise.resolve(window.CONFIG || {});
        }
        
        // Pick random theme, avoiding current one if possible
        let nextTheme;
        if (themes.length > 1 && this.currentTheme) {
            const availableThemes = themes.filter(t => t !== this.currentTheme);
            nextTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
        } else {
            nextTheme = themes[Math.floor(Math.random() * themes.length)];
        }
        
        return this.loadThemeScript(nextTheme);
    },
    
    /**
     * Load a specific theme by name (legacy mode)
     */
    loadSpecificTheme: function(themeName) {
        // Try to find theme in collections
        for (const collection in this.collections) {
            const theme = this.collections[collection].find(t => 
                t.includes(themeName + '.js')
            );
            if (theme) {
                return this.loadThemeScript(theme);
            }
        }
        
        // Fallback: try direct path
        const themePath = `config/${themeName}.js`;
        return this.loadThemeScript(themePath);
    },
    
    /**
     * Load theme script dynamically
     */
    loadThemeScript: function(themePath) {
        return new Promise((resolve, reject) => {
            // Check cache first
            if (this.loadedThemes.has(themePath)) {
                this.currentTheme = themePath;
                window.CONFIG = JSON.parse(JSON.stringify(this.loadedThemes.get(themePath)));
                console.log(`Loaded theme from cache: ${themePath}`);
                if (this.onThemeChange) this.onThemeChange(window.CONFIG);
                resolve(window.CONFIG);
                return;
            }
            
            // Remove old theme script if exists
            const oldScript = document.querySelector('script[data-theme-config]');
            if (oldScript) oldScript.remove();
            
            // Load new theme
            const script = document.createElement('script');
            script.src = themePath + '?t=' + Date.now(); // Cache busting
            script.dataset.themeConfig = 'true';
            
            script.onload = () => {
                this.currentTheme = themePath;
                // Cache the loaded config (deep clone)
                if (window.CONFIG) {
                    this.loadedThemes.set(themePath, JSON.parse(JSON.stringify(window.CONFIG)));
                }
                console.log(`Loaded theme: ${themePath}`);
                if (this.onThemeChange) this.onThemeChange(window.CONFIG);
                resolve(window.CONFIG);
            };
            
            script.onerror = () => {
                console.error(`Failed to load theme: ${themePath}`);
                reject(new Error(`Failed to load theme: ${themePath}`));
            };
            
            document.head.appendChild(script);
        });
    },
    
    /**
     * Get next theme for rotation (called on reset)
     */
    getNextTheme: function() {
        if (!this.rotationMode) {
            return Promise.resolve(window.CONFIG);
        }
        return this.loadRandomTheme(this.rotationMode);
    },
    
    /**
     * Check if rotation is enabled
     */
    isRotationEnabled: function() {
        return this.rotationMode !== null;
    }
};