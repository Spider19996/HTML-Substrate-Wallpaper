// Config validator with safe defaults
const ConfigValidator = {
    defaults: {
        STEP: 0.7,
        CRACKS_PER_100K_PIXELS: 1,
        MIN_INITIAL_CRACKS: 2,
        MAX_INITIAL_CRACKS: 20,
        MAX_CRACKS: 100,
        CIRCLE_PERCENT: 40,
        GRAINS: 64,
        SAND_MODE: 'both',
        LINE_WIDTH: 1,
        RESET_AFTER_SECONDS: 60,
        FADE_OUT_SECONDS: 3,
        HARD_RESET_EVERY: 3,
        HARD_FADE_SECONDS: 2,
        HARD_FADE_IN_SECONDS: 2,
        BRANCH_MODE: 'perpendicular',
        LINE_DRIFT_ENABLED: false,
        LINE_DRIFT_AMOUNT: 2,
        LINE_DRIFT_FREQUENCY: 0.3,
        SPARKLER_ENABLED: true,
        SPARK_SPAWN_RATE: 3,
        SPARK_SPEED_MIN: 0.5,
        SPARK_SPEED_MAX: 2.5,
        SPARK_LIFETIME: 15,
        SPARK_SIZE: 1.3,
        SPARK_GLOW: 2.0,
        CLICK_SPAWN_ENABLED: false,
        CURSOR_SPARKS_ENABLED: false,
        CURSOR_SPARK_RATE: 2,
        FPS_COUNTER_ENABLED: false,
        FPS_COUNTER_POSITION: 'top-left',
        FPS_COUNTER_SIZE: 14,
        FPS_COUNTER_COLOR: [0, 0, 0],
        TARGET_FPS: 60,
        FG_COLOR: [0, 0, 0],
        BG_COLOR: [255, 255, 255],
        COLORS: [
            [255, 50, 50],
            [50, 255, 50],
            [50, 50, 255],
            [255, 255, 0],
            [255, 0, 255],
            [0, 255, 255]
        ]
    },

    validate: function(config) {
        const validated = {};
        const errors = [];

        // Helper functions
        const isNumber = (val) => typeof val === 'number' && !isNaN(val);
        const isPositive = (val) => isNumber(val) && val >= 0;
        const isInRange = (val, min, max) => isNumber(val) && val >= min && val <= max;
        const isColor = (val) => Array.isArray(val) && val.length === 3 && 
            val.every(c => isNumber(c) && c >= 0 && c <= 255);

        // Validate each config option
        for (const key in this.defaults) {
            const value = config?.[key];
            const defaultValue = this.defaults[key];

            switch(key) {
                case 'STEP':
                    validated[key] = isPositive(value) && value <= 10 ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be 0-10, using default ${defaultValue}`);
                    }
                    break;

                case 'CRACKS_PER_100K_PIXELS':
                case 'MIN_INITIAL_CRACKS':
                case 'MAX_INITIAL_CRACKS':
                case 'MAX_CRACKS':
                    validated[key] = isPositive(value) && value <= 500 ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be 0-500, using default ${defaultValue}`);
                    }
                    break;

                case 'CIRCLE_PERCENT':
                    validated[key] = isInRange(value, 0, 100) ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be 0-100, using default ${defaultValue}`);
                    }
                    break;

                case 'GRAINS':
                    validated[key] = isPositive(value) && value <= 256 ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be 0-256, using default ${defaultValue}`);
                    }
                    break;

                case 'SAND_MODE':
                    validated[key] = ['both', 'one', 'none'].includes(value) ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be 'both', 'one', or 'none', using default '${defaultValue}'`);
                    }
                    break;

                case 'LINE_WIDTH':
                    validated[key] = isPositive(value) && value <= 20 ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be 0-20, using default ${defaultValue}`);
                    }
                    break;

                case 'RESET_AFTER_SECONDS':
                case 'FADE_OUT_SECONDS':
                case 'HARD_RESET_EVERY':
                case 'HARD_FADE_SECONDS':
                case 'HARD_FADE_IN_SECONDS':
                    validated[key] = isPositive(value) ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be >= 0, using default ${defaultValue}`);
                    }
                    break;

                case 'BRANCH_MODE':
                    validated[key] = ['perpendicular', 'opposite', 'any'].includes(value) ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be 'perpendicular', 'opposite', or 'any', using default '${defaultValue}'`);
                    }
                    break;

                case 'LINE_DRIFT_ENABLED':
                case 'SPARKLER_ENABLED':
                case 'CLICK_SPAWN_ENABLED':
                case 'CURSOR_SPARKS_ENABLED':
                case 'FPS_COUNTER_ENABLED':
                    validated[key] = typeof value === 'boolean' ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be boolean, using default ${defaultValue}`);
                    }
                    break;

                case 'LINE_DRIFT_AMOUNT':
                    validated[key] = isInRange(value, 0, 45) ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be 0-45, using default ${defaultValue}`);
                    }
                    break;

                case 'LINE_DRIFT_FREQUENCY':
                    validated[key] = isInRange(value, 0, 1) ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be 0-1, using default ${defaultValue}`);
                    }
                    break;

                case 'SPARK_SPAWN_RATE':
                case 'SPARK_LIFETIME':
                case 'CURSOR_SPARK_RATE':
                    validated[key] = isPositive(value) && value <= 100 ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be 0-100, using default ${defaultValue}`);
                    }
                    break;

                case 'SPARK_SPEED_MIN':
                case 'SPARK_SPEED_MAX':
                case 'SPARK_SIZE':
                case 'SPARK_GLOW':
                    validated[key] = isPositive(value) && value <= 50 ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be 0-50, using default ${defaultValue}`);
                    }
                    break;

                case 'FPS_COUNTER_POSITION':
                    validated[key] = ['top-left', 'top-right'].includes(value) ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be 'top-left' or 'top-right', using default '${defaultValue}'`);
                    }
                    break;

                case 'FPS_COUNTER_SIZE':
                    validated[key] = isPositive(value) && value <= 100 ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be 0-100, using default ${defaultValue}`);
                    }
                    break;

                case 'TARGET_FPS':
                    validated[key] = isPositive(value) && value <= 240 ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be 0-240, using default ${defaultValue}`);
                    }
                    break;

                case 'FG_COLOR':
                case 'BG_COLOR':
                case 'FPS_COUNTER_COLOR':
                    validated[key] = isColor(value) ? value : defaultValue;
                    if (validated[key] === defaultValue && value !== undefined) {
                        errors.push(`${key}: must be [R, G, B] with values 0-255, using default`);
                    }
                    break;

                case 'COLORS':
                    if (Array.isArray(value) && value.length > 0 && value.every(isColor)) {
                        validated[key] = value;
                    } else {
                        validated[key] = defaultValue;
                        if (value !== undefined) {
                            errors.push(`${key}: must be array of [R, G, B] colors, using default`);
                        }
                    }
                    break;

                default:
                    validated[key] = value !== undefined ? value : defaultValue;
            }
        }

        // Cross-validation
        if (validated.SPARK_SPEED_MIN > validated.SPARK_SPEED_MAX) {
            errors.push('SPARK_SPEED_MIN must be <= SPARK_SPEED_MAX, swapping values');
            [validated.SPARK_SPEED_MIN, validated.SPARK_SPEED_MAX] = 
                [validated.SPARK_SPEED_MAX, validated.SPARK_SPEED_MIN];
        }

        if (validated.MIN_INITIAL_CRACKS > validated.MAX_INITIAL_CRACKS) {
            errors.push('MIN_INITIAL_CRACKS must be <= MAX_INITIAL_CRACKS, swapping values');
            [validated.MIN_INITIAL_CRACKS, validated.MAX_INITIAL_CRACKS] = 
                [validated.MAX_INITIAL_CRACKS, validated.MIN_INITIAL_CRACKS];
        }

        return { config: validated, errors };
    }
};
