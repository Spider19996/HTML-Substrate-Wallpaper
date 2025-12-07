// Spark object pool for performance
const SparkPool = {
    pool: [],
    maxSize: 2000,  // Increased from 1000
    
    get: function(x, y, color) {
        let spark;
        if (this.pool.length > 0) {
            spark = this.pool.pop();
            spark.reset(x, y, color);
        } else {
            spark = new Spark(x, y, color);
        }
        return spark;
    },
    
    release: function(spark) {
        if (this.pool.length < this.maxSize) {
            this.pool.push(spark);
        }
    }
};

function Spark(x, y, color) {
    this.x = x; 
    this.y = y; 
    this.color = color;
    this.colorKey = `${color[0]},${color[1]},${color[2]}`;
    const angle = Math.random() * PI2;
    const speed = CONFIG.SPARK_SPEED_MIN + Math.random() * (CONFIG.SPARK_SPEED_MAX - CONFIG.SPARK_SPEED_MIN);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = CONFIG.SPARK_LIFETIME;
    this.maxLife = CONFIG.SPARK_LIFETIME;
}

// Reset spark for reuse
Spark.prototype.reset = function(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.colorKey = `${color[0]},${color[1]},${color[2]}`;
    const angle = Math.random() * PI2;
    const speed = CONFIG.SPARK_SPEED_MIN + Math.random() * (CONFIG.SPARK_SPEED_MAX - CONFIG.SPARK_SPEED_MIN);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = CONFIG.SPARK_LIFETIME;
    this.maxLife = CONFIG.SPARK_LIFETIME;
};

// Gradient cache to avoid recreating gradients every frame
Spark.gradientCache = {};

Spark.prototype.update = function() {
    this.x += this.vx; 
    this.y += this.vy;
    this.life--; 
    this.vy += 0.05;
};

Spark.prototype.draw = function(glowCtx, fadingIn) {
    const fadeMultiplier = fadingIn ? 0.5 : 1;
    const alpha = (this.life / this.maxLife) * fadeMultiplier;
    
    if (CONFIG.SPARK_GLOW > 0) {
        // Use cached gradient pattern
        if (!Spark.gradientCache[this.colorKey]) {
            const tempCanvas = document.createElement('canvas');
            const size = CONFIG.SPARK_GLOW * 2 + 2;
            tempCanvas.width = size;
            tempCanvas.height = size;
            const tempCtx = tempCanvas.getContext('2d');
            const gradient = tempCtx.createRadialGradient(size/2, size/2, 0, size/2, size/2, CONFIG.SPARK_GLOW);
            gradient.addColorStop(0, `rgba(${this.color[0]},${this.color[1]},${this.color[2]},0.3)`);
            gradient.addColorStop(1, `rgba(${this.color[0]},${this.color[1]},${this.color[2]},0)`);
            tempCtx.fillStyle = gradient;
            tempCtx.fillRect(0, 0, size, size);
            Spark.gradientCache[this.colorKey] = tempCanvas;
        }
        
        glowCtx.globalAlpha = alpha;
        glowCtx.drawImage(Spark.gradientCache[this.colorKey], 
            this.x - CONFIG.SPARK_GLOW - 1, 
            this.y - CONFIG.SPARK_GLOW - 1);
        glowCtx.globalAlpha = 1;
    }
    
    glowCtx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${alpha})`;
    glowCtx.fillRect(Math.floor(this.x), Math.floor(this.y), CONFIG.SPARK_SIZE, CONFIG.SPARK_SIZE);
};

Spark.prototype.isDead = function() {
    return this.life <= 0;
};
