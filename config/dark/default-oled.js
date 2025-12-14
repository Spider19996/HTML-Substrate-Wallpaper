const CONFIG = {
    // LINE BEHAVIOR
    STEP_MIN:                0.1,
    STEP_MAX:                1.5,
    CRACKS_PER_100K_PIXELS:  1,
    MIN_INITIAL_CRACKS:      2,
    MAX_INITIAL_CRACKS:      20,
    MAX_CRACKS:              100,
    CIRCLE_PERCENT:          40,
    
    // VISUAL EFFECTS
    GRAINS:                  64,
    SAND_MODE:               'both',
    SAND_ALPHA:              0.1,
    LINE_WIDTH:              1,
    ANTI_ALIASING:           true,
    
    // ANIMATION TIMING
    RESET_AFTER_SECONDS:     0,
    COVERAGE_RESET_PERCENT:  10,
    FADE_OUT_SECONDS:        3,
    HARD_RESET_EVERY:        3,
    HARD_FADE_SECONDS:       2,
    HARD_FADE_IN_SECONDS:    2,
    
    // BRANCHING BEHAVIOR
    BRANCH_MODE:             'perpendicular',
    
    // LINE DRIFT
    LINE_DRIFT_ENABLED:      false,
    LINE_DRIFT_AMOUNT:       2,
    LINE_DRIFT_FREQUENCY:    0.3,
    
    // SPARKLER EFFECT
    SPARKLER_ENABLED:        true,
    SPARK_SPAWN_RATE:        3,
    SPARK_SPEED_MIN:         0.5,
    SPARK_SPEED_MAX:         2.5,
    SPARK_LIFETIME:          15,
    SPARK_SIZE:              1.3,
    SPARK_GLOW:              2.0,
    
    // MOUSE INTERACTION
    CLICK_SPAWN_ENABLED:     false,
    CURSOR_SPARKS_ENABLED:   false,
    CURSOR_SPARK_RATE:       2,
    
    // FPS SETTINGS
    FPS_COUNTER_ENABLED:     false,
    FPS_COUNTER_POSITION:    'top-left',
    FPS_COUNTER_SIZE:        14,
    FPS_COUNTER_COLOR:       [255, 255, 255],
    TARGET_FPS:              60,
    
    // COLORS
    BG_COLOR:                [0, 0, 0],
    COLORS: [
        [255, 50, 50],
        [50, 255, 50],
        [50, 50, 255],
        [255, 255, 0],
        [255, 0, 255],
        [0, 255, 255]
    ]
};