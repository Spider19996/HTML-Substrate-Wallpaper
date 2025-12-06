const CONFIG = {
    // Line behavior
    STEP:                    0.7,
    CRACKS_PER_100K_PIXELS:  1,
    MIN_INITIAL_CRACKS:      2,
    MAX_INITIAL_CRACKS:      20,
    MAX_CRACKS:              100,
    CIRCLE_PERCENT:          40,
    
    // Visual effects
    GRAINS:                  64,
    SAND_MODE:               'both',
    LINE_WIDTH:              1,
    
    // Animation timing
    RESET_AFTER_SECONDS:     60,
    FADE_OUT_SECONDS:        3,
    HARD_RESET_EVERY:        3,
    HARD_FADE_SECONDS:       2,
    HARD_FADE_IN_SECONDS:    2,
    
    // Branching behavior
    BRANCH_MODE:             'perpendicular',
    
    // Line drift
    LINE_DRIFT_ENABLED:      false,
    LINE_DRIFT_AMOUNT:       2,
    LINE_DRIFT_FREQUENCY:    0.3,
    
    // Sparkler effect
    SPARKLER_ENABLED:        true,
    SPARK_SPAWN_RATE:        3,
    SPARK_SPEED_MIN:         0.5,
    SPARK_SPEED_MAX:         2.5,
    SPARK_LIFETIME:          15,
    SPARK_SIZE:              1.3,
    SPARK_GLOW:              2.0,
    
    // Mouse interaction
    CLICK_SPAWN_ENABLED:     false,  // Disabled for HTML Wallpaper compatibility
    CURSOR_SPARKS_ENABLED:   false,  // Disabled for HTML Wallpaper compatibility
    CURSOR_SPARK_RATE:       2,
    
    // FPS Settings
    FPS_COUNTER_ENABLED:     false,
    FPS_COUNTER_POSITION:    'top-left',
    FPS_COUNTER_SIZE:        14,
    FPS_COUNTER_COLOR:       [0, 0, 0],
    TARGET_FPS:              60,     // FPS limit (0 = unlimited)
    
    // Colors
    FG_COLOR:                [0, 0, 0],
    BG_COLOR:                [255, 255, 255],
    COLORS: [
        [255, 50, 50],
        [50, 255, 50],
        [50, 50, 255],
        [255, 255, 0],
        [255, 0, 255],
        [0, 255, 255]
    ]
};
