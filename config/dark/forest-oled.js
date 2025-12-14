const CONFIG = {
    // LINE BEHAVIOR
    STEP_MIN:                0.1,
    STEP_MAX:                1.5,
    CRACKS_PER_100K_PIXELS:  1.5,
    MIN_INITIAL_CRACKS:      3,
    MAX_INITIAL_CRACKS:      25,
    MAX_CRACKS:              120,
    CIRCLE_PERCENT:          30,
    
    // VISUAL EFFECTS
    GRAINS:                  80,
    SAND_MODE:               'both',
    SAND_ALPHA:              0.15,
    LINE_WIDTH:              1.2,
    ANTI_ALIASING:           true,
    
    // ANIMATION TIMING
    RESET_AFTER_SECONDS:     0,
    COVERAGE_RESET_PERCENT:  12,
    FADE_OUT_SECONDS:        4,
    HARD_RESET_EVERY:        4,
    HARD_FADE_SECONDS:       3,
    HARD_FADE_IN_SECONDS:    2.5,
    
    // BRANCHING BEHAVIOR
    BRANCH_MODE:             'perpendicular',
    
    // LINE DRIFT
    LINE_DRIFT_ENABLED:      true,
    LINE_DRIFT_AMOUNT:       1.5,
    LINE_DRIFT_FREQUENCY:    0.4,
    
    // SPARKLER EFFECT
    SPARKLER_ENABLED:        true,
    SPARK_SPAWN_RATE:        4,
    SPARK_SPEED_MIN:         0.3,
    SPARK_SPEED_MAX:         2.0,
    SPARK_LIFETIME:          20,
    SPARK_SIZE:              1.5,
    SPARK_GLOW:              2.5,
    
    // MOUSE INTERACTION
    CLICK_SPAWN_ENABLED:     false,
    CURSOR_SPARKS_ENABLED:   false,
    CURSOR_SPARK_RATE:       2,
    
    // FPS SETTINGS
    FPS_COUNTER_ENABLED:     false,
    FPS_COUNTER_POSITION:    'top-left',
    FPS_COUNTER_SIZE:        14,
    FPS_COUNTER_COLOR:       [120, 150, 115],
    TARGET_FPS:              60,
    
    // COLORS
    BG_COLOR:                [0, 0, 0],
    COLORS: [
        [76, 110, 70],
        [120, 90, 60],
        [140, 115, 75],
        [90, 120, 85],
        [160, 130, 90],
        [100, 85, 70]
    ]
};