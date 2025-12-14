const CONFIG = {
    // LINE BEHAVIOR
    STEP_MIN:                0.1,      // Minimum movement speed of cracks in pixels per frame
    STEP_MAX:                1.5,      // Maximum movement speed of cracks in pixels per frame (creates varied line speeds)
    CRACKS_PER_100K_PIXELS:  1.5,      // Initial cracks per 100k pixels of screen area (controls pattern density)
    MIN_INITIAL_CRACKS:      3,        // Minimum number of cracks at startup
    MAX_INITIAL_CRACKS:      25,       // Maximum number of cracks at startup
    MAX_CRACKS:              120,      // Maximum total cracks allowed simultaneously (lower = better performance)
    CIRCLE_PERCENT:          30,       // Percentage chance (0-100) that a crack will be curved instead of straight
    
    // VISUAL EFFECTS
    GRAINS:                  80,       // Number of sand grains per region (0 = no sand, higher = more detail but slower)
    SAND_MODE:               'both',   // Sand drawing mode: 'both' (both sides), 'one' (one side), 'none' (disabled)
    SAND_ALPHA:              0.15,     // Maximum opacity of sand grains (0.0-1.0, higher = more visible/vibrant colors)
    LINE_WIDTH:              1.2,      // Width of crack lines in pixels
    ANTI_ALIASING:           true,     // Enable smooth anti-aliased rendering (true = better quality, false = better performance)
    
    // ANIMATION TIMING
    RESET_AFTER_SECONDS:     0,        // Disabled - now uses coverage-based reset
    COVERAGE_RESET_PERCENT:  12,       // Canvas coverage % before reset (0-100, lower = more frequent resets)
    FADE_OUT_SECONDS:        4,        // Duration of fade-out effect in seconds (0 = instant reset)
    HARD_RESET_EVERY:        4,        // Number of soft resets before hard reset (0 = never hard reset, clears everything)
    HARD_FADE_SECONDS:       3,        // Duration of hard fade-out in seconds
    HARD_FADE_IN_SECONDS:    2.5,      // Duration of fade-in effect after hard reset
    
    // BRANCHING BEHAVIOR
    BRANCH_MODE:             'perpendicular',  // How new cracks branch: 'perpendicular' = 90° angles
    
    // LINE DRIFT
    LINE_DRIFT_ENABLED:      true,     // Enable random directional drift for straight lines
    LINE_DRIFT_AMOUNT:       1.5,      // Maximum angle change in degrees per drift event
    LINE_DRIFT_FREQUENCY:    0.4,      // Probability (0-1) of drift occurring each frame
    
    // SPARKLER EFFECT
    SPARKLER_ENABLED:        true,     // Enable particle sparkles along crack lines
    SPARK_SPAWN_RATE:        4,        // Number of sparks spawned per frame per crack
    SPARK_SPEED_MIN:         0.3,      // Minimum spark velocity
    SPARK_SPEED_MAX:         2.0,      // Maximum spark velocity
    SPARK_LIFETIME:          20,       // Frames until spark disappears
    SPARK_SIZE:              1.5,      // Size of spark particles in pixels
    SPARK_GLOW:              2.5,      // Glow radius around sparks (0 = no glow)
    
    // MOUSE INTERACTION
    CLICK_SPAWN_ENABLED:     false,    // Enable spawning new cracks on mouse click (disabled for wallpaper mode)
    CURSOR_SPARKS_ENABLED:   false,    // Enable continuous spark generation at cursor (disabled for wallpaper mode)
    CURSOR_SPARK_RATE:       2,        // Number of cursor sparks spawned per frame when enabled
    
    // FPS SETTINGS
    FPS_COUNTER_ENABLED:     false,    // Display FPS counter on screen
    FPS_COUNTER_POSITION:    'top-left', // Counter position: 'top-left' or 'top-right'
    FPS_COUNTER_SIZE:        14,       // Font size of FPS counter in pixels
    FPS_COUNTER_COLOR:       [120, 150, 115], // RGB color of FPS counter text [R, G, B] (0-255 each)
    TARGET_FPS:              60,       // Maximum framerate limit (0 = unlimited, lower = less CPU/GPU usage)
    
    // COLORS
    BG_COLOR:                [0, 0, 0], // Black background for OLED
    COLORS: [                           // Forest-inspired earth tone palette
        [76, 110, 70],    // Deep Forest Green
        [120, 90, 60],    // Rich Brown
        [140, 115, 75],   // Golden Oak
        [90, 120, 85],    // Moss Green
        [160, 130, 90],   // Amber
        [100, 85, 70]     // Dark Earth
    ]
};