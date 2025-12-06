window.onload = function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    const glowCanvas = document.getElementById('glowCanvas');
    const glowCtx = glowCanvas.getContext('2d', { alpha: true });
    
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
    
    // Display config errors to user if any
    if (configErrors.length > 0) {
        showConfigWarning(configErrors);
    }
    
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    canvas.width = canvasWidth; canvas.height = canvasHeight;
    glowCanvas.width = canvasWidth; glowCanvas.height = canvasHeight;
    
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    glowCtx.imageSmoothingEnabled = true; glowCtx.imageSmoothingQuality = 'high';

    document.body.style.background = `rgb(${CONFIG.BG_COLOR[0]},${CONFIG.BG_COLOR[1]},${CONFIG.BG_COLOR[2]})`;

    // State
    let cracks = [], sparks = [], cgrid = new Array(canvasWidth * canvasHeight).fill(10001);
    let startTime = Date.now(), fadingOut = false, fadeStartTime = 0, resetCounter = 0;
    let hardFading = false, fadingIn = false, fadeInStartTime = 0;
    let fps = 60, frameCount = 0, fpsUpdateTime = Date.now();
    let mouseX = -100, mouseY = -100, mouseInCanvas = false;
    let lastFrameTime = Date.now();
    let resizeTimeout = null;

    function showConfigWarning(errors) {
        const warningDiv = document.createElement('div');
        warningDiv.id = 'config-warning';
        warningDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 50, 50, 0.95);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            font-family: monospace;
            font-size: 14px;
            max-width: 600px;
            max-height: 400px;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            line-height: 1.5;
        `;
        
        let html = '<strong style="font-size: 16px;">⚠️ Configuration Warning</strong><br><br>';
        html += '<div style="text-align: left;">';
        errors.forEach(error => {
            html += '• ' + error + '<br>';
        });
        html += '</div><br>';
        html += '<div style="text-align: center; margin-top: 10px;">';
        html += '<button id="dismiss-warning" style="';
        html += 'background: white; color: #ff3232; border: none; padding: 8px 20px; ';
        html += 'border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 12px;';
        html += '">Dismiss (5s)</button>';
        html += '</div>';
        
        warningDiv.innerHTML = html;
        document.body.appendChild(warningDiv);
        
        // Auto-dismiss after 5 seconds
        let countdown = 5;
        const dismissBtn = document.getElementById('dismiss-warning');
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                dismissBtn.textContent = `Dismiss (${countdown}s)`;
            } else {
                clearInterval(interval);
                warningDiv.remove();
            }
        }, 1000);
        
        // Manual dismiss
        dismissBtn.addEventListener('click', () => {
            clearInterval(interval);
            warningDiv.remove();
        });
    }

    function makeCrack(x = null, y = null) {
        if (cracks.length < CONFIG.MAX_CRACKS) {
            cracks.push(new Crack(x, y, canvasWidth, canvasHeight, cgrid));
        }
    }

    function reset() {
        // Release all sparks back to pool
        for (let i = 0; i < sparks.length; i++) {
            SparkPool.release(sparks[i]);
        }
        cracks = []; sparks = []; 
        cgrid = new Array(canvasWidth * canvasHeight).fill(10001);
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
        
        // Restore rendering quality after resize
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        glowCtx.imageSmoothingEnabled = true;
        glowCtx.imageSmoothingQuality = 'high';
        
        // Fill new area with background color
        ctx.fillStyle = `rgb(${CONFIG.BG_COLOR[0]},${CONFIG.BG_COLOR[1]},${CONFIG.BG_COLOR[2]})`;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Restore old content
        ctx.drawImage(oldCanvas, 0, 0);
        glowCtx.drawImage(oldGlowCanvas, 0, 0);
        
        // Create new larger grid and copy old data
        const newGrid = new Array(canvasWidth * canvasHeight).fill(10001);
        for (let y = 0; y < Math.min(oldHeight, canvasHeight); y++) {
            for (let x = 0; x < Math.min(oldWidth, canvasWidth); x++) {
                const oldIdx = y * oldWidth + x;
                const newIdx = y * canvasWidth + x;
                newGrid[newIdx] = cgrid[oldIdx];
            }
        }
        cgrid = newGrid;
        
        // Update crack references to new grid and dimensions
        for (let i = 0; i < cracks.length; i++) {
            cracks[i].canvasWidth = canvasWidth;
            cracks[i].canvasHeight = canvasHeight;
            cracks[i].cgrid = cgrid;
        }
        
        // Remove cracks that are now out of bounds
        for (let i = cracks.length - 1; i >= 0; i--) {
            if (cracks[i].x < 0 || cracks[i].x >= canvasWidth || 
                cracks[i].y < 0 || cracks[i].y >= canvasHeight) {
                cracks.splice(i, 1);
            }
        }
        
        // Remove sparks that are now out of bounds
        for (let i = sparks.length - 1; i >= 0; i--) {
            if (sparks[i].x < 0 || sparks[i].x >= canvasWidth || 
                sparks[i].y < 0 || sparks[i].y >= canvasHeight) {
                SparkPool.release(sparks[i]);
                sparks.splice(i, 1);
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
        const alpha = hardFading ? 0.06 : 0.04;
        ctx.fillStyle = `rgba(${CONFIG.BG_COLOR[0]},${CONFIG.BG_COLOR[1]},${CONFIG.BG_COLOR[2]},${alpha})`;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        if (fadeProgress >= 1) {
            if (hardFading) {
                ctx.fillStyle = `rgb(${CONFIG.BG_COLOR[0]},${CONFIG.BG_COLOR[1]},${CONFIG.BG_COLOR[2]})`;
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

    function animate() {
        // FPS limiting
        const currentTime = Date.now();
        if (CONFIG.TARGET_FPS > 0) {
            const targetFrameTime = 1000 / CONFIG.TARGET_FPS;
            const elapsed = currentTime - lastFrameTime;
            if (elapsed < targetFrameTime) {
                requestAnimationFrame(animate);
                return;
            }
            lastFrameTime = currentTime - (elapsed % targetFrameTime);
        }
        
        frameCount++;
        
        glowCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        if (fadingOut) applyFadeOverlay();
        
        if (!fadingOut) {
            // Remove dead cracks while processing
            for (let i = cracks.length - 1; i >= 0; i--) {
                cracks[i].move(ctx, sparks, fadingIn, fadingOut, makeCrack);
                if (!cracks[i].alive) cracks.splice(i, 1);
            }
        }
        
        spawnCursorSparks();
        
        // Combined spark update, draw and cleanup in one loop with object pooling
        for (let i = sparks.length - 1; i >= 0; i--) {
            sparks[i].update();
            if (sparks[i].isDead()) {
                SparkPool.release(sparks[i]);
                sparks.splice(i, 1);
            } else {
                sparks[i].draw(glowCtx, fadingIn);
            }
        }
        
        if (fadingIn && getFadeInProgress() >= 1) fadingIn = false;
        
        if (!fadingOut && !fadingIn && 
            (cracks.length === 0 || (CONFIG.RESET_AFTER_SECONDS > 0 && (currentTime - startTime) / 1000 > CONFIG.RESET_AFTER_SECONDS))) {
            if (CONFIG.FADE_OUT_SECONDS > 0) startFadeOut();
            else {
                ctx.fillStyle = `rgb(${CONFIG.BG_COLOR[0]},${CONFIG.BG_COLOR[1]},${CONFIG.BG_COLOR[2]})`;
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                reset();
            }
        }
        
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
        
        requestAnimationFrame(animate);
    }

    ctx.fillStyle = `rgb(${CONFIG.BG_COLOR[0]},${CONFIG.BG_COLOR[1]},${CONFIG.BG_COLOR[2]})`;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    reset();
    animate();
};
