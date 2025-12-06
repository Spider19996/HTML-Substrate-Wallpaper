/*
 * SUBSTRATE WALLPAPER CONFIGURATION
 * 
 * This file controls all visual and behavioral aspects of the animation.
 * Adjust values to customize the appearance and performance.
 */

const CONFIG = {
    // ============================================================
    // LINE BEHAVIOR
    // ============================================================
    
    // Movement speed of cracks (pixels per frame)
    // Higher = faster growing lines
    STEP: 0.7,
    
    // Number of initial cracks per 100,000 pixels of screen area
    // Controls density of line patterns
    CRACKS_PER_100K_PIXELS: 1,
    
    // Minimum number of initial cracks at startup
    MIN_INITIAL_CRACKS: 2,
    
    // Maximum number of initial cracks at startup
    MAX_INITIAL_CRACKS: 20,
    
    // Maximum total number of cracks allowed simultaneously
    // Higher = more complex patterns but lower performance
    MAX_CRACKS: 100,
    
    // Percentage chance (0-100) that a crack will be curved instead of straight
    CIRCLE_PERCENT: 40,
    
    // ============================================================
    // VISUAL EFFECTS
    // ============================================================
    
    // Number of sand grains drawn per region (0 = no sand)
    // Higher = more detailed but slower
    GRAINS: 64,
    
    // Sand drawing mode: 'both' (both sides), 'one' (one side), 'none' (disabled)
    SAND_MODE: 'both',
    
    // Width of the crack lines in pixels
    LINE_WIDTH: 1,
    
    // ============================================================
    // ANIMATION TIMING
    // ============================================================
    
    // Seconds before automatic reset (0 = only reset when no cracks left)
    RESET_AFTER_SECONDS: 60,
    
    // Duration of fade-out effect in seconds (0 = instant reset)
    FADE_OUT_SECONDS: 3,
    
    // Number of soft resets before performing a hard reset (0 = never hard reset)
    // Hard reset clears everything, soft reset keeps some visual elements
    HARD_RESET_EVERY: 3,
    
    // Duration of hard fade-out in seconds
    HARD_FADE_SECONDS: 2,
    
    // Duration of fade-in effect after hard reset
    HARD_FADE_IN_SECONDS: 2,
    
    // ============================================================
    // BRANCHING BEHAVIOR
    // ============================================================
    
    // How new cracks branch from existing ones
    // 'perpendicular' = 90° angles, other modes available in code
    BRANCH_MODE: 'perpendicular',
    
    // ============================================================
    // LINE DRIFT
    // ============================================================
    
    // Enable random directional drift for straight lines
    LINE_DRIFT_ENABLED: false,
    
    // Maximum angle change in degrees per drift event
    LINE_DRIFT_AMOUNT: 2,
    
    // Probability (0-1) of drift occurring each frame
    LINE_DRIFT_FREQUENCY: 0.3,
    
    // ============================================================
    // SPARKLER EFFECT
    // ============================================================
    
    // Enable particle sparkles along crack lines
    SPARKLER_ENABLED: true,
    
    // Number of sparks spawned per frame per crack
    SPARK_SPAWN_RATE: 3,
    
    // Minimum spark velocity
    SPARK_SPEED_MIN: 0.5,
    
    // Maximum spark velocity
    SPARK_SPEED_MAX: 2.5,
    
    // Frames until spark disappears
    SPARK_LIFETIME: 15,
    
    // Size of spark particles in pixels
    SPARK_SIZE: 1.3,
    
    // Glow radius around sparks (0 = no glow)
    SPARK_GLOW: 2.0,
    
    // ============================================================
    // MOUSE INTERACTION
    // ============================================================
    
    // Enable spawning new cracks on mouse click
    // Disabled by default for HTML Wallpaper compatibility
    CLICK_SPAWN_ENABLED: false,
    
    // Enable continuous spark generation at cursor position
    // Disabled by default for HTML Wallpaper compatibility
    CURSOR_SPARKS_ENABLED: false,
    
    // Number of cursor sparks spawned per frame when enabled
    CURSOR_SPARK_RATE: 2,
    
    // ============================================================
    // FPS SETTINGS
    // ============================================================
    
    // Display FPS counter on screen
    FPS_COUNTER_ENABLED: false,
    
    // Counter position: 'top-left' or 'top-right'
    FPS_COUNTER_POSITION: 'top-left',
    
    // Font size of FPS counter in pixels
    FPS_COUNTER_SIZE: 14,
    
    // RGB color of FPS counter text [R, G, B]
    FPS_COUNTER_COLOR: [0, 0, 0],
    
    // Maximum framerate limit (0 = unlimited)
    // Lower values reduce CPU/GPU usage
    TARGET_FPS: 60,
    
    // ============================================================
    // COLORS
    // ============================================================
    
    // Main line color [R, G, B] (0-255 each)
    FG_COLOR: [0, 0, 0],
    
    // Background color [R, G, B] (0-255 each)
    BG_COLOR: [255, 255, 255],
    
    // Sand and spark color palette (randomly selected)
    // Add or remove colors as desired
    COLORS: [
        [255, 50, 50],   // Red
        [50, 255, 50],   // Green
        [50, 50, 255],   // Blue
        [255, 255, 0],   // Yellow
        [255, 0, 255],   // Magenta
        [0, 255, 255]    // Cyan
    ]
};
