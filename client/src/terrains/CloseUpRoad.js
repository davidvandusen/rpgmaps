const BaseTerrain = require('./BaseTerrain');

class CloseUpRoad extends BaseTerrain {
  drawStone(x, y, r) {
    this.ctx.beginPath();
    this.drawIrregularCircle(x, y, r, 0.15, 15);
    this.ctx.closePath();
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, '#dad3c1');
    gradient.addColorStop(0.9, '#fef9ec');
    gradient.addColorStop(1, '#dad3c1');
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    this.ctx.strokeStyle = '#a39c8a';
    this.ctx.lineWidth = this.scaleFactorX * 0.1;
    this.ctx.stroke();
  }

  makeScaledStone(x, y, r, posVariance, scaleVariance) {
    return [
      (x + (this.rng() - 0.5) * posVariance) * this.scaleFactorX,
      (y + (this.rng() - 0.5) * posVariance) * this.scaleFactorY,
      (r + (this.rng() - 0.5) * scaleVariance) * this.scaleFactorX
    ];
  }

  base() {
    return new Promise((resolve, reject) => {
      this.ctx.save();
      this.fillShape(this.smoothOutlineShape, '#c7bfac');
      this.ctx.restore();

      this.smoothOutlineShape.forEach(path => this.drawPath(path));
      this.ctx.strokeStyle = '#d6cdbb';
      this.ctx.strokeWidth = 2;
      this.ctx.stroke();

      const allStones = this.mask.map((x, y, i) => {
        const stoneNumRand = this.rng();
        if (stoneNumRand < 0.5) {
          return [
            this.makeScaledStone(x + 0.5, y + 0.5, 0.4, 0.3, 0.2),
            this.makeScaledStone(x, y, 0.2, 0.1, 0.1),
            this.makeScaledStone(x + 1, y, 0.2, 0.1, 0.1)
          ];
        } else if (stoneNumRand < 0.7) {
          return [
            this.makeScaledStone(x + 0.2, y + 0.2, 0.3, 0.25, 0.2),
            this.makeScaledStone(x + 0.8, y + 0.8, 0.3, 0.25, 0.2),
            this.makeScaledStone(x + 0.8, y + 0.2, 0.2, 0.25, 0.2),
            this.makeScaledStone(x + 0.2, y + 0.8, 0.2, 0.25, 0.2)
          ];
        } else if (stoneNumRand < 0.9) {
          return [
            this.makeScaledStone(x + 0.8, y + 0.2, 0.3, 0.25, 0.2),
            this.makeScaledStone(x + 0.2, y + 0.8, 0.3, 0.25, 0.2),
            this.makeScaledStone(x + 0.2, y + 0.2, 0.2, 0.25, 0.2),
            this.makeScaledStone(x + 0.8, y + 0.8, 0.2, 0.25, 0.2)
          ];
        } else {
          return [
            this.makeScaledStone(x + 0.25, y + 0.25, 0.25, 0.25, 0.2),
            this.makeScaledStone(x + 0.25, y + 0.75, 0.25, 0.25, 0.2),
            this.makeScaledStone(x + 0.75, y + 0.25, 0.25, 0.25, 0.2),
            this.makeScaledStone(x + 0.75, y + 0.75, 0.25, 0.25, 0.2)
          ];
        }
      });

      [].concat(...allStones)
        .sort((stoneA, stoneB) => stoneA[2] - stoneB[2])
        .forEach(stone => this.drawStone(...stone));

      resolve();
    });
  }

  overlay() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}

module.exports = CloseUpRoad;
