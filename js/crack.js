let nextCrackId = 0;

function Crack(startX, startY, canvasWidth, canvasHeight, cgrid, coverageCallback) {
    this.id = nextCrackId++;
    this.manualStart = (startX !== null && startY !== null);
    this.x = startX !== null ? startX : Math.random() * canvasWidth;
    this.y = startY !== null ? startY : Math.random() * canvasHeight;
    this.t = Math.random() * 360;
    this.curved = false;
    this.degreesDrawn = 0;
    this.sandG = Math.random() * 0.2 - 0.01;
    this.sandP = 0;
    this.sandColor = CONFIG.COLORS[Math.floor(Math.random() * CONFIG.COLORS.length)];
    this.lineColor = this.sandColor; // Lines now use same color as sand/sparks
    this.alive = true;
    this.lastX = this.x;
    this.lastY = this.y;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.cgrid = cgrid;
    this.coverageCallback = coverageCallback;
    this.startCrack();
}

Crack.prototype.startCrack = function() {
    let px = Math.floor(this.x), py = Math.floor(this.y);
    
    if (!this.manualStart) {
        let found = false, timeout = 0;
        while (!found && timeout < 1000) {
            timeout++;
            px = Math.floor(Math.random() * this.canvasWidth);
            py = Math.floor(Math.random() * this.canvasHeight);
            if (getCGrid(px, py, this.cgrid, this.canvasWidth, this.canvasHeight) < 10000) found = true;
        }
        if (!found) {
            px = Math.floor(this.x);
            py = Math.floor(this.y);
        }
    }
    
    const oldA = getCGrid(px, py, this.cgrid, this.canvasWidth, this.canvasHeight);
    let a;
    
    // If manual start and empty pixel, use random direction
    if (this.manualStart && oldA > 10000) {
        a = Math.random() * 360;
    }
    // If grid is empty (initial crack or no intersection found), use random direction
    else if (oldA > 10000) {
        a = Math.random() * 360;
    }
    // Otherwise branch from existing crack
    else {
        a = getBranchAngle(oldA);
    }
    
    if (Math.random() * 100 < CONFIG.CIRCLE_PERCENT) {
        this.curved = true;
        this.degreesDrawn = 0;
        let r = 10 + Math.random() * (this.canvasWidth + this.canvasHeight) / 2;
        if (Math.random() > 0.5) r = -r;
        const radInc = CONFIG.STEP / r;
        this.tInc = radInc * 180 / Math.PI;
        this.ys = r * Math.sin(radInc);
        this.xs = r * (1 - Math.cos(radInc));
    }
    
    if (this.manualStart) {
        this.t = a;
    } else {
        this.x = px + 0.61 * Math.cos(a * DEG_TO_RAD);
        this.y = py + 0.61 * Math.sin(a * DEG_TO_RAD);
        this.t = a;
    }
    this.lastX = this.x;
    this.lastY = this.y;
};

Crack.prototype.drawSandRegion = function(ctx, direction) {
    let rx = this.x, ry = this.y, openspace = true;
    const dirMult = direction;
    const tRad = this.t * DEG_TO_RAD;
    const sinT = Math.sin(tRad);
    const cosT = Math.cos(tRad);
    
    while (openspace) {
        rx += dirMult * 0.81 * sinT;
        ry -= dirMult * 0.81 * cosT;
        const cx = Math.floor(rx), cy = Math.floor(ry);
        if (cx < 0 || cx >= this.canvasWidth || cy < 0 || cy >= this.canvasHeight || 
            getCGrid(cx, cy, this.cgrid, this.canvasWidth, this.canvasHeight) <= 10000) {
            openspace = false;
        }
    }
    
    this.sandG += Math.random() * 0.1 - 0.05;
    this.sandG = Math.max(0, Math.min(1, this.sandG));
    const w = this.sandG / (CONFIG.GRAINS - 1);
    
    // Optimized: Group grains by similar alpha and draw in batches
    const alphaGroups = {};
    for (let i = 0; i < CONFIG.GRAINS; i++) {
        const alpha = Math.floor((0.1 - i / (CONFIG.GRAINS * 10)) * 100) / 100;
        if (!alphaGroups[alpha]) alphaGroups[alpha] = [];
        
        const sinVal = Math.sin(this.sandP + Math.sin(i * w));
        const drawX = this.x + (rx - this.x) * sinVal;
        const drawY = this.y + (ry - this.y) * sinVal;
        alphaGroups[alpha].push({x: drawX, y: drawY});
    }
    
    // Draw each alpha group in one batch
    Object.keys(alphaGroups).forEach(alpha => {
        const grains = alphaGroups[alpha];
        if (grains.length === 0) return;
        
        ctx.fillStyle = `rgba(${this.sandColor[0]},${this.sandColor[1]},${this.sandColor[2]},${alpha})`;
        ctx.beginPath();
        grains.forEach(grain => {
            ctx.moveTo(grain.x + 0.5, grain.y);
            ctx.arc(grain.x, grain.y, 0.5, 0, PI2);
        });
        ctx.fill();
    });
};

Crack.prototype.regionColor = function(ctx) {
    if (CONFIG.SAND_MODE === 'none') return;
    if (CONFIG.SAND_MODE === 'both') {
        this.drawSandRegion(ctx, 1);
        this.drawSandRegion(ctx, -1);
    } else {
        this.drawSandRegion(ctx, 1);
    }
};

Crack.prototype.spawnSparks = function(sparks) {
    if (!CONFIG.SPARKLER_ENABLED) return;
    for (let i = 0; i < CONFIG.SPARK_SPAWN_RATE; i++) {
        sparks.push(SparkPool.get(this.x, this.y, this.sandColor));
    }
};

Crack.prototype.applyDrift = function() {
    if (!CONFIG.LINE_DRIFT_ENABLED || this.curved) return;
    if (Math.random() < CONFIG.LINE_DRIFT_FREQUENCY) {
        const drift = (Math.random() * 2 - 1) * CONFIG.LINE_DRIFT_AMOUNT;
        this.t += drift;
    }
};

Crack.prototype.move = function(ctx, sparks, fadingIn, fadingOut, makeCrackFunc, path) {
    if (!this.alive) return;
    
    this.lastX = this.x;
    this.lastY = this.y;
    this.applyDrift();
    
    const tRad = this.t * DEG_TO_RAD;
    
    if (!this.curved) {
        this.x += CONFIG.STEP * Math.cos(tRad);
        this.y += CONFIG.STEP * Math.sin(tRad);
    } else {
        const cosT = Math.cos(tRad);
        const sinT = Math.sin(tRad);
        const cosT2 = Math.cos(tRad - Math.PI / 2);
        const sinT2 = Math.sin(tRad - Math.PI / 2);
        this.x += this.ys * cosT + this.xs * cosT2;
        this.y += this.ys * sinT + this.xs * sinT2;
        this.t += this.tInc;
        this.degreesDrawn += Math.abs(this.tInc);
    }
    
    // Cache random for reuse
    const rand = Math.random();
    const cx = Math.floor(this.x + rand * 0.33 - 0.165);
    const cy = Math.floor(this.y + rand * 0.33 - 0.165);
    
    if (cx >= 0 && cx < this.canvasWidth && cy >= 0 && cy < this.canvasHeight) {
        this.regionColor(ctx);
        
        // Add line to shared Path2D instead of stroking individually
        path.moveTo(this.lastX, this.lastY);
        path.lineTo(this.x, this.y);
        
        this.spawnSparks(sparks);
        
        if (this.curved && this.degreesDrawn > 360) {
            this.alive = false;
            if (!fadingOut) {
                makeCrackFunc();
                makeCrackFunc();
            }
        } else if (getCGrid(cx, cy, this.cgrid, this.canvasWidth, this.canvasHeight) > 10000 || 
                   Math.abs(getCGrid(cx, cy, this.cgrid, this.canvasWidth, this.canvasHeight) - this.t) < 5) {
            setCGrid(cx, cy, this.t, this.cgrid, this.canvasWidth, this.canvasHeight, this.coverageCallback);
        } else if (Math.abs(getCGrid(cx, cy, this.cgrid, this.canvasWidth, this.canvasHeight)) > 2) {
            this.alive = false;
            if (!fadingOut) {
                makeCrackFunc();
                makeCrackFunc();
            }
        }
    } else {
        this.alive = false;
        if (!fadingOut) {
            makeCrackFunc();
            makeCrackFunc();
        }
    }
};