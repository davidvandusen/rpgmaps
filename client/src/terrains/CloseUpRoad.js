const BaseTerrain = require('./BaseTerrain');
const {rgbaToCss} = require('../common/color');

class CloseUpRoad extends BaseTerrain {
  base() {
    return new Promise((resolve, reject) => {
      this.ctx.save();
      this.drawShape(this.smoothOutlineShape);
      this.mask.forEach((x, y, i) => {
        if (x % 2 || y % 2) return;
        const x0 = (x + 1) * this.scaleFactorX + (this.rng() * this.scaleFactorX - this.scaleFactorX * 0.5);
        const y0 = (y + 1) * this.scaleFactorY + (this.rng() * this.scaleFactorY - this.scaleFactorY * 0.5);
        const r1 = 4 * this.scaleFactorX + (this.rng() * this.scaleFactorX);
        const gradient = this.ctx.createRadialGradient(x0, y0, 0, x0, y0, r1);
        const darkenAmt = Math.floor(this.rng() * 70);
        const red = 214 - darkenAmt;
        const green = 205 - darkenAmt;
        const blue = 188 - darkenAmt;
        gradient.addColorStop(0, rgbaToCss(red, green, blue, 180));
        gradient.addColorStop(1, rgbaToCss(red, green, blue, 0));
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      });
      this.ctx.restore();

      this.mask.map((x, y, i) => {
        const x0 = x;
        const y0 = y;
        const stoneNumRand = this.rng();
        if (stoneNumRand < 0.5) {
          return [
            this.makeScaledStone(x0 + 0.5, y0 + 0.5, 0.4, 0.3, 0.2),
            this.makeScaledStone(x0, y0, 0.2, 0.1, 0.1),
            this.makeScaledStone(x0 + 1, y0 + 1, 0.2, 0.1, 0.1)
          ];
        } else if (stoneNumRand < 0.7) {
          return [
            this.makeScaledStone(x0 + 0.2, y0 + 0.2, 0.3, 0.25, 0.2),
            this.makeScaledStone(x0 + 0.8, y0 + 0.8, 0.3, 0.25, 0.2),
            this.makeScaledStone(x0 + 0.8, y0 + 0.2, 0.2, 0.25, 0.2),
            this.makeScaledStone(x0 + 0.2, y0 + 0.8, 0.2, 0.25, 0.2)
          ];
        } else if (stoneNumRand < 0.9) {
          return [
            this.makeScaledStone(x0 + 0.8, y0 + 0.2, 0.3, 0.25, 0.2),
            this.makeScaledStone(x0 + 0.2, y0 + 0.8, 0.3, 0.25, 0.2),
            this.makeScaledStone(x0 + 0.2, y0 + 0.2, 0.2, 0.25, 0.2),
            this.makeScaledStone(x0 + 0.8, y0 + 0.8, 0.2, 0.25, 0.2)
          ];
        } else {
          return [
            this.makeScaledStone(x0 + 0.25, y0 + 0.25, 0.25, 0.25, 0.2),
            this.makeScaledStone(x0 + 0.25, y0 + 0.75, 0.25, 0.25, 0.2),
            this.makeScaledStone(x0 + 0.75, y0 + 0.25, 0.25, 0.25, 0.2),
            this.makeScaledStone(x0 + 0.75, y0 + 0.75, 0.25, 0.25, 0.2)
          ];
        }
      }).sort(this.rng).forEach(stones => stones.sort(this.rng).forEach(stone => this.drawStone(...stone)));
      resolve();
    });
  }

  drawIrregularCircle(x, y, r, jitterAmount, segments) {
    let theta = 0;
    const t = 2 * Math.PI;
    const segmentAngle = t / segments;
    do {
      const l = r * (1 - jitterAmount) + this.rng() * r * 2 * jitterAmount;
      const x1 = x + l * Math.cos(theta);
      const y1 = y + l * Math.sin(theta);
      if (theta === 0) this.ctx.moveTo(x1, y1);
      else this.ctx.lineTo(x1, y1);
      theta += segmentAngle;
    } while (theta < t);
  }

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

  overlay() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}

module.exports = CloseUpRoad;
