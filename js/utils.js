function getCGrid(x, y, cgrid, width, height) {
    if (x < 0 || x >= width || y < 0 || y >= height) return 10001;
    return cgrid[y * width + x];
}

function setCGrid(x, y, val, cgrid, width, height, coverageCallback) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    // Track coverage: if pixel was empty (10001) and now gets painted, increment coverage
    if (cgrid[idx] === 10001 && val !== 10001 && coverageCallback) {
        coverageCallback();
    }
    cgrid[idx] = val;
}

function getBranchAngle(a) {
    let angle;
    if (CONFIG.BRANCH_MODE === 'perpendicular') {
        angle = a + (Math.random() < 0.5 ? 90 : -90);
    } else if (CONFIG.BRANCH_MODE === 'opposite') {
        angle = a + 180 + (Math.random() * 10 - 5);
    } else {
        angle = Math.random() * 360;
    }
    return angle;
}