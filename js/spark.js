function Spark(x, y, color) {
    this.x = x; 
    this.y = y; 
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = CONFIG.SPARK_SPEED_MIN + Math.random() * (CONFIG.SPARK_SPEED_MAX - CONFIG.SPARK_SPEED_MIN);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = CONFIG.SPARK_LIFETIME;
    this.maxLife = CONFIG.SPARK_LIFETIME;
}

Spark.prototype.update = function() {
    this.x += this.vx; 
    this.y += this.vy;
    this.life--; 
    this.vy += 0.05;
};

Spark.prototype.draw = function(glowCtx, fadingIn, fadeInStartTime) {
    const fadeMultiplier = fadingIn ? 0.5 : 1;
    const alpha = (this.life / this.maxLife) * fadeMultiplier;
    
    if (CONFIG.SPARK_GLOW > 0) {
        const gradient = glowCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, CONFIG.SPARK_GLOW);
        gradient.addColorStop(0, `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(${this.color[0]},${this.color[1]},${this.color[2]},0)`);
        glowCtx.fillStyle = gradient;
        glowCtx.beginPath();
        glowCtx.arc(this.x, this.y, CONFIG.SPARK_GLOW, 0, Math.PI * 2);
        glowCtx.fill();
    }
    
    glowCtx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${alpha})`;
    glowCtx.fillRect(Math.floor(this.x), Math.floor(this.y), CONFIG.SPARK_SIZE, CONFIG.SPARK_SIZE);
};

Spark.prototype.isDead = function() {
    return this.life <= 0;
};
