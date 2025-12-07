// Math constants cache
const DEG_TO_RAD = Math.PI / 180;
const PI2 = Math.PI * 2;

window.onload = function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', { 
        alpha: false, 
        desynchronized: true,
        willReadFrequently: false  // Important for performance
    });
    const glowCanvas = document.getElementById('glowCanvas');
    const glowCtx = glowCanvas.getContext('2d', { 
        alpha: true, 
        desynchronized: true,
        willReadFrequently: false
    });
    
    // Validate and sanitize CONFIG or use defaults
    let validatedConfig;
    let configErrors = [];
    try {
        if (typeof CONFIG === 'undefined') {
            console.warn('CONFIG not found, using defaults');
            configErrors.push('CONFIG not found, using default settings');
            validatedConfig = ConfigValidator.validate({});
        } else {
            validatedConfig = ConfigValidator.validate(CONFIG);
            if (validatedConfig.errors.length > 0) {
                console.warn('Config validation warnings:', validatedConfig.errors);
                configErrors = validatedConfig.errors;
            }
        }
        // Replace global CONFIG with validated version
        window.CONFIG = validatedConfig.config;
    } catch (error) {
        console.error('Config validation failed:', error);
        console.warn('Using default configuration');
        configErrors.push('Config validation failed: ' + error.message);
        configErrors.push('Using default configuration');
        window.CONFIG = ConfigValidator.defaults;
    }
    
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    canvas.width = canvasWidth; canvas.height = canvasHeight;
    glowCanvas.width = canvasWidth; glowCanvas.height = canvasHeight;
    
    ctx.imageSmoothingEnabled = false; // Disable for performance
    glowCtx.imageSmoothingEnabled = false;

    document.body.style.background = `rgb(${CONFIG.BG_COLOR[0]},${CONFIG.BG_COLOR[1]},${CONFIG.BG_COLOR[2]})`;

    // Pre-cache color strings
    let bgColorString = `rgb(${CONFIG.BG_COLOR[0]},${CONFIG.BG_COLOR[1]},${CONFIG.BG_COLOR[2]})`;
    let fadeOverlayString = `rgba(${CONFIG.BG_COLOR[0]},${CONFIG.BG_COLOR[1]},${CONFIG.BG_COLOR[2]},0.04)`;
    let fadeOverlayHardString = `rgba(${CONFIG.BG_COLOR[0]},${CONFIG.BG_COLOR[1]},${CONFIG.BG_COLOR[2]},0.06)`;

    // State - Use Typed Array for cgrid (faster memory access)
    let cracks = [], sparks = [], cgrid = new Float32Array(canvasWidth * canvasHeight).fill(10001);
    let startTime = Date.now(), fadingOut = false, fadeStartTime = 0, resetCounter = 0;
    let hardFading = false, fadingIn = false, fadeInStartTime = 0;
    let fps = 60, frameCount = 0, fpsUpdateTime = Date.now();
    let mouseX = -100, mouseY = -100, mouseInCanvas = false;
    let lastFrameTime = Date.now();
    let resizeTimeout = null;
    let warningText = configErrors.length > 0 ? configErrors : null;
    let warningStartTime = configErrors.length > 0 ? Date.now() : null;
    const warningDuration = 8000; // 8 seconds
    let rafId = null; // Track RAF ID for cancellation
    
    // Coverage tracking
    let coveredPixels = 0;
    let totalPixels = canvasWidth * canvasHeight;
    
    // Tab visibility detection with RAF cancellation
    let isTabVisible = true;
    document.addEventListener('visibilitychange', () => {
        const wasVisible = isTabVisible;
        isTabVisible = !document.hidden;
        
        // Resume animation when tab becomes visible again
        if (!wasVisible && isTabVisible && rafId === null) {
            lastFrameTime = Date.now(); // Reset frame timing
            animate();
        }
    });
    
    // Coverage callback function
    const incrementCoverage = () => { coveredPixels++; };

    function makeCrack(x = null, y = null) {
        if (cracks.length < CONFIG.MAX_CRACKS) {
            cracks.push(new Crack(x, y, canvasWidth, canvasHeight, cgrid, incrementCoverage));
        }
    }

    function reset() {
        // Release all sparks back to pool
        for (let i = 0; i < sparks.length; i++) {
            SparkPool.release(sparks[i]);
        }
        cracks = []; sparks = []; 
        cgrid = new Float32Array(canvasWidth * canvasHeight).fill(10001);
        coveredPixels = 0;
        totalPixels = canvasWidth * canvasHeight;
        startTime = Date.now(); fadingOut = false; hardFading = false;
        const area = canvasWidth * canvasHeight;
        const initialCracks = Math.floor(area / 100000 * CONFIG.CRACKS_PER_100K_PIXELS);
        const clampedCracks = Math.max(CONFIG.MIN_INITIAL_CRACKS, Math.min(CONFIG.MAX_INITIAL_CRACKS, initialCracks));
        for (let i = 0; i < clampedCracks; i++) makeCrack();
    }

    function handleResize() {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        // Only resize if dimensions actually changed
        if (newWidth === canvasWidth && newHeight === canvasHeight) return;
        
        // Store old canvas content
        const oldCanvas = document.createElement('canvas');
        oldCanvas.width = canvasWidth;
        oldCanvas.height = canvasHeight;
        const oldCtx = oldCanvas.getContext('2d');
        oldCtx.drawImage(canvas, 0, 0);
        
        const oldGlowCanvas = document.createElement('canvas');
        oldGlowCanvas.width = canvasWidth;
        oldGlowCanvas.height = canvasHeight;
        const oldGlowCtx = oldGlowCanvas.getContext('2d');
        oldGlowCtx.drawImage(glowCanvas, 0, 0);
        
        const oldWidth = canvasWidth;
        const oldHeight = canvasHeight;
        
        // Update dimensions
        canvasWidth = newWidth;
        canvasHeight = newHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        glowCanvas.width = canvasWidth;
        glowCanvas.height = canvasHeight;
        totalPixels = canvasWidth * canvasHeight;
        
        // Restore rendering quality after resize
        ctx.imageSmoothingEnabled = false;
        glowCtx.imageSmoothingEnabled = false;
        
        // Fill new area with background color
        ctx.fillStyle = bgColorString;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Restore old content
        ctx.drawImage(oldCanvas, 0, 0);
        glowCtx.drawImage(oldGlowCanvas, 0, 0);
        
        // Create new larger grid and copy old data (Typed Array)
        const newGrid = new Float32Array(canvasWidth * canvasHeight).fill(10001);
        let newCoveredPixels = 0;
        for (let y = 0; y < Math.min(oldHeight, canvasHeight); y++) {
            for (let x = 0; x < Math.min(oldWidth, canvasWidth); x++) {
                const oldIdx = y * oldWidth + x;
                const newIdx = y * canvasWidth + x;
                newGrid[newIdx] = cgrid[oldIdx];
                if (cgrid[oldIdx] !== 10001) newCoveredPixels++;
            }
        }
        cgrid = newGrid;
        coveredPixels = newCoveredPixels;
        
        // Update crack references to new grid and dimensions
        for (let i = 0; i < cracks.length; i++) {
            cracks[i].canvasWidth = canvasWidth;
            cracks[i].canvasHeight = canvasHeight;
            cracks[i].cgrid = cgrid;
            cracks[i].coverageCallback = incrementCoverage;
        }
        
        // Remove cracks that are now out of bounds (swap-and-pop)
        for (let i = cracks.length - 1; i >= 0; i--) {
            if (cracks[i].x < 0 || cracks[i].x >= canvasWidth || 
                cracks[i].y < 0 || cracks[i].y >= canvasHeight) {
                cracks[i] = cracks[cracks.length - 1];
                cracks.pop();
            }
        }
        
        // Remove sparks that are now out of bounds (swap-and-pop)
        for (let i = sparks.length - 1; i >= 0; i--) {
            if (sparks[i].x < 0 || sparks[i].x >= canvasWidth || 
                sparks[i].y < 0 || sparks[i].y >= canvasHeight) {
                SparkPool.release(sparks[i]);
                sparks[i] = sparks[sparks.length - 1];
                sparks.pop();
            }
        }
    }

    // Debounced resize handler to avoid excessive resets
    window.addEventListener('resize', function() {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });

    function getFadeProgress() {
        if (!fadingOut) return 0;
        const elapsed = (Date.now() - fadeStartTime) / 1000;
        const duration = hardFading ? CONFIG.HARD_FADE_SECONDS : CONFIG.FADE_OUT_SECONDS;
        return Math.min(elapsed / duration, 1);
    }

    function getFadeInProgress() {
        if (!fadingIn) return 1;
        const elapsed = (Date.now() - fadeInStartTime) / 1000;
        return Math.min(elapsed / CONFIG.HARD_FADE_IN_SECONDS, 1);
    }

    function applyFadeOverlay() {
        const fadeProgress = getFadeProgress();
        ctx.fillStyle = hardFading ? fadeOverlayHardString : fadeOverlayString;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        if (fadeProgress >= 1) {
            if (hardFading) {
                ctx.fillStyle = bgColorString;
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                resetCounter = 0; reset(); startFadeIn();
            } else {
                resetCounter++; reset();
            }
        }
    }

    function startFadeOut() {
        fadingOut = true; fadeStartTime = Date.now();
        hardFading = CONFIG.HARD_RESET_EVERY > 0 && resetCounter >= CONFIG.HARD_RESET_EVERY - 1;
    }

    function startFadeIn() {
        fadingIn = true; fadeInStartTime = Date.now();
    }

    // Mouse events
    canvas.addEventListener('click', (e) => {
        if (!CONFIG.CLICK_SPAWN_ENABLED) return;
        const rect = canvas.getBoundingClientRect();
        makeCrack(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        mouseInCanvas = true;
    });

    canvas.addEventListener('mouseleave', () => {
        mouseInCanvas = false;
    });

    function spawnCursorSparks() {
        if (!CONFIG.CURSOR_SPARKS_ENABLED || !mouseInCanvas) return;
        for (let i = 0; i < CONFIG.CURSOR_SPARK_RATE; i++) {
            sparks.push(SparkPool.get(mouseX, mouseY, CONFIG.FG_COLOR));
        }
    }

    // Use requestIdleCallback for non-critical FPS counter updates
    function updateFPSCounter() {
        if (!CONFIG.FPS_COUNTER_ENABLED) return;
        
        const updateFPS = () => {
            const currentTime = Date.now();
            if (currentTime - fpsUpdateTime >= 1000) {
                fps = Math.round(frameCount * 1000 / (currentTime - fpsUpdateTime));
                frameCount = 0;
                fpsUpdateTime = currentTime;
            }
            
            if ('requestIdleCallback' in window) {
                requestIdleCallback(updateFPS, { timeout: 1000 });
            } else {
                setTimeout(updateFPS, 1000);
            }
        };
        
        if ('requestIdleCallback' in window) {
            requestIdleCallback(updateFPS);
        } else {
            setTimeout(updateFPS, 1000);
        }
    }
    
    updateFPSCounter();

    function drawConfigWarning() {
        if (!warningText || !warningStartTime) return;
        
        const elapsed = Date.now() - warningStartTime;
        if (elapsed > warningDuration) {
            warningText = null;
            warningStartTime = null;
            return;
        }
        
        // Calculate fade out in last 2 seconds
        let alpha = 1;
        if (elapsed > warningDuration - 2000) {
            alpha = (warningDuration - elapsed) / 2000;
        }
        
        glowCtx.save();
        glowCtx.textAlign = 'left';
        glowCtx.font = '14px monospace';
        
        const padding = 20;
        const lineHeight = 20;
        let y = padding + lineHeight;
        
        // Draw warning header
        glowCtx.fillStyle = `rgba(255, 50, 50, ${alpha})`;
        glowCtx.font = 'bold 16px monospace';
        glowCtx.fillText('⚠️ Configuration Warning', padding, y);
        y += lineHeight * 1.5;
        
        // Draw warning messages
        glowCtx.font = '13px monospace';
        glowCtx.fillStyle = `rgba(255, 100, 100, ${alpha})`;
        warningText.forEach(error => {
            // Word wrap for long messages
            const maxWidth = canvasWidth - padding * 2;
            const words = error.split(' ');
            let line = '';
            
            words.forEach(word => {
                const testLine = line + word + ' ';
                const metrics = glowCtx.measureText(testLine);
                if (metrics.width > maxWidth && line !== '') {
                    glowCtx.fillText('• ' + line, padding, y);
                    y += lineHeight;
                    line = word + ' ';
                } else {
                    line = testLine;
                }
            });
            glowCtx.fillText('• ' + line, padding, y);
            y += lineHeight;
        });
        
        glowCtx.restore();
    }

    function getCoveragePercent() {
        return coveredPixels / totalPixels;
    }

    function animate() {
        // Cancel RAF and exit when tab not visible
        if (!isTabVisible) {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            return;
        }
        
        // FPS limiting with better precision
        const currentTime = Date.now();
        if (CONFIG.TARGET_FPS > 0) {
            const targetFrameTime = 1000 / CONFIG.TARGET_FPS;
            const elapsed = currentTime - lastFrameTime;
            if (elapsed < targetFrameTime - 1) { // -1ms tolerance
                rafId = requestAnimationFrame(animate);
                return;
            }
            lastFrameTime = currentTime - (elapsed % targetFrameTime);
        }
        
        frameCount++;
        
        glowCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        if (fadingOut) applyFadeOverlay();
        
        if (!fadingOut) {
            // Draw each crack with its individual color
            ctx.lineWidth = CONFIG.LINE_WIDTH;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            // Process and draw cracks individually
            for (let i = cracks.length - 1; i >= 0; i--) {
                const path = new Path2D();
                cracks[i].move(ctx, sparks, fadingIn, fadingOut, makeCrack, path);
                
                // Draw this crack's line with its color
                const alpha = fadingIn ? 0.5 : 1;
                ctx.strokeStyle = `rgba(${cracks[i].lineColor[0]},${cracks[i].lineColor[1]},${cracks[i].lineColor[2]},${alpha})`;
                ctx.stroke(path);
                
                // Remove dead cracks (swap-and-pop)
                if (!cracks[i].alive) {
                    cracks[i] = cracks[cracks.length - 1];
                    cracks.pop();
                }
            }
        }
        
        spawnCursorSparks();
        
        // Combined spark update, draw and cleanup with swap-and-pop
        for (let i = sparks.length - 1; i >= 0; i--) {
            sparks[i].update();
            if (sparks[i].isDead()) {
                SparkPool.release(sparks[i]);
                sparks[i] = sparks[sparks.length - 1];
                sparks.pop();
            } else {
                sparks[i].draw(glowCtx, fadingIn);
            }
        }
        
        if (fadingIn && getFadeInProgress() >= 1) fadingIn = false;
        
        // Coverage-based reset
        const coverage = getCoveragePercent();
        const coverageThreshold = CONFIG.COVERAGE_RESET_PERCENT / 100;
        if (!fadingOut && !fadingIn && (cracks.length === 0 || coverage >= coverageThreshold)) {
            if (CONFIG.FADE_OUT_SECONDS > 0) startFadeOut();
            else {
                ctx.fillStyle = bgColorString;
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                reset();
            }
        }
        
        // Config warning (drawn before FPS counter)
        drawConfigWarning();
        
        // FPS Counter (only drawing, update happens in idle callback)
        if (CONFIG.FPS_COUNTER_ENABLED) {
            const padding = 10;
            let x = padding, y = padding + CONFIG.FPS_COUNTER_SIZE;
            glowCtx.textAlign = 'left';
            if (CONFIG.FPS_COUNTER_POSITION === 'top-right') {
                x = canvasWidth - padding; glowCtx.textAlign = 'right';
            }
            glowCtx.font = `${CONFIG.FPS_COUNTER_SIZE}px monospace`;
            glowCtx.fillStyle = `rgb(${CONFIG.FPS_COUNTER_COLOR[0]},${CONFIG.FPS_COUNTER_COLOR[1]},${CONFIG.FPS_COUNTER_COLOR[2]})`;
            glowCtx.fillText(`FPS: ${fps}`, x, y);
        }
        
        rafId = requestAnimationFrame(animate);
    }

    ctx.fillStyle = bgColorString;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    reset();
    animate();
};