function getCGrid(x, y, cgrid, canvasWidth, canvasHeight) {
    if (x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) return 10001;
    return cgrid[Math.floor(x) + Math.floor(y) * canvasWidth];
}

function setCGrid(x, y, val, cgrid, canvasWidth, canvasHeight) {
    if (x < 0 || x >= canvasWidth || y < 0 || y >= canvasHeight) return;
    cgrid[Math.floor(x) + Math.floor(y) * canvasWidth] = val;
}

function getBranchAngle(baseAngle) {
    let angleOffset;
    switch(CONFIG.BRANCH_MODE) {
        case 'perpendicular': 
            angleOffset = (Math.random() > 0.5 ? 90 : -90); 
            break;
        case 'opposite': 
            const angles = [90, -90, 180, -180];
            angleOffset = angles[Math.floor(Math.random() * angles.length)]; 
            break;
        case 'any': 
            return baseAngle + Math.random() * 360 + (Math.random() * 4 - 2);
        default: 
            angleOffset = (Math.random() > 0.5 ? 90 : -90);
    }
    return baseAngle + angleOffset + (Math.random() * 4 - 2);
}
