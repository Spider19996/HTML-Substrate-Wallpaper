window.onload = function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    const glowCanvas = document.getElementById('glowCanvas');
    const glowCtx = glowCanvas.getContext('2d', { alpha: true });
    
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

    function makeCrack(x = null, y = null) {
        if (cracks.length < CONFIG.MAX_CRACKS) {
            cracks.push(new Crack(x, y, canvasWidth, canvasHeight, cgrid));
        }
    }

    function reset() {
        cracks = []; sparks = []; 
        cgrid = new Array(canvasWidth * canvasHeight).fill(10001);
        startTime = Date.now(); fadingOut = false; hardFading = false;
        const area = canvasWidth * canvasHeight;
        const initialCracks = Math.floor(area / 100000 * CONFIG.CRACKS_PER_100K_PIXELS);
        const clampedCracks = Math.max(CONFIG.MIN_INITIAL_CRACKS, Math.min(CONFIG.MAX_INITIAL_CRACKS, initialCracks));
        for (let i = 0; i < clampedCracks; i++) makeCrack();
    }

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
            sparks.push(new Spark(mouseX, mouseY, CONFIG.FG_COLOR));
        }
    }

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
        if (currentTime - fpsUpdateTime >= 1000) {
            fps = Math.round(frameCount * 1000 / (currentTime - fpsUpdateTime));
            frameCount = 0; fpsUpdateTime = currentTime;
        }
        
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
        
        // Combined spark update, draw and cleanup in one loop
        for (let i = sparks.length - 1; i >= 0; i--) {
            sparks[i].update();
            if (sparks[i].isDead()) {
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
        
        // FPS Counter
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
