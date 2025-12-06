let nextCrackId = 0;

function Crack(startX, startY, canvasWidth, canvasHeight, cgrid) {
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
    this.alive = true;
    this.lastX = this.x;
    this.lastY = this.y;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.cgrid = cgrid;
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
    let a = this.manualStart && oldA > 10000 ? Math.random() * 360 : getBranchAngle(oldA);
    
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
        this.x = px + 0.61 * Math.cos(a * Math.PI / 180);
        this.y = py + 0.61 * Math.sin(a * Math.PI / 180);
        this.t = a;
    }
    this.lastX = this.x;
    this.lastY = this.y;
};

Crack.prototype.drawSandRegion = function(ctx, direction) {
    let rx = this.x, ry = this.y, openspace = true;
    const dirMult = direction;
    
    while (openspace) {
        rx += dirMult * 0.81 * Math.sin(this.t * Math.PI / 180);
        ry -= dirMult * 0.81 * Math.cos(this.t * Math.PI / 180);
        const cx = Math.floor(rx), cy = Math.floor(ry);
        if (cx < 0 || cx >= this.canvasWidth || cy < 0 || cy >= this.canvasHeight || 
            getCGrid(cx, cy, this.cgrid, this.canvasWidth, this.canvasHeight) <= 10000) {
            openspace = false;
        }
    }
    
    this.sandG += Math.random() * 0.1 - 0.05;
    this.sandG = Math.max(0, Math.min(1, this.sandG));
    const w = this.sandG / (CONFIG.GRAINS - 1);
    
    for (let i = 0; i < CONFIG.GRAINS; i++) {
        const drawX = this.x + (rx - this.x) * Math.sin(this.sandP + Math.sin(i * w));
        const drawY = this.y + (ry - this.y) * Math.sin(this.sandP + Math.sin(i * w));
        const alpha = (0.1 - i / (CONFIG.GRAINS * 10));
        ctx.fillStyle = `rgba(${this.sandColor[0]},${this.sandColor[1]},${this.sandColor[2]},${alpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
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
        sparks.push(new Spark(this.x, this.y, this.sandColor));
    }
};

Crack.prototype.applyDrift = function() {
    if (!CONFIG.LINE_DRIFT_ENABLED || this.curved) return;
    if (Math.random() < CONFIG.LINE_DRIFT_FREQUENCY) {
        const drift = (Math.random() * 2 - 1) * CONFIG.LINE_DRIFT_AMOUNT;
        this.t += drift;
    }
};

Crack.prototype.move = function(ctx, sparks, fadingIn, fadingOut, makeCrackFunc) {
    if (!this.alive) return;
    
    this.lastX = this.x;
    this.lastY = this.y;
    this.applyDrift();
    
    if (!this.curved) {
        this.x += CONFIG.STEP * Math.cos(this.t * Math.PI / 180);
        this.y += CONFIG.STEP * Math.sin(this.t * Math.PI / 180);
    } else {
        this.x += this.ys * Math.cos(this.t * Math.PI / 180) + this.xs * Math.cos(this.t * Math.PI / 180 - Math.PI / 2);
        this.y += this.ys * Math.sin(this.t * Math.PI / 180) + this.xs * Math.sin(this.t * Math.PI / 180 - Math.PI / 2);
        this.t += this.tInc;
        this.degreesDrawn += Math.abs(this.tInc);
    }
    
    const cx = Math.floor(this.x + Math.random() * 0.33 - 0.165);
    const cy = Math.floor(this.y + Math.random() * 0.33 - 0.165);
    
    if (cx >= 0 && cx < this.canvasWidth && cy >= 0 && cy < this.canvasHeight) {
        this.regionColor(ctx);
        const fadeMultiplier = fadingIn ? 0.5 : 1;
        ctx.strokeStyle = `rgba(${CONFIG.FG_COLOR[0]},${CONFIG.FG_COLOR[1]},${CONFIG.FG_COLOR[2]},${fadeMultiplier})`;
        ctx.lineWidth = CONFIG.LINE_WIDTH;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(this.lastX, this.lastY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        
        this.spawnSparks(sparks);
        
        if (this.curved && this.degreesDrawn > 360) {
            this.alive = false;
            if (!fadingOut) {
                makeCrackFunc();
                makeCrackFunc();
            }
        } else if (getCGrid(cx, cy, this.cgrid, this.canvasWidth, this.canvasHeight) > 10000 || 
                   Math.abs(getCGrid(cx, cy, this.cgrid, this.canvasWidth, this.canvasHeight) - this.t) < 5) {
            setCGrid(cx, cy, this.t, this.cgrid, this.canvasWidth, this.canvasHeight);
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
