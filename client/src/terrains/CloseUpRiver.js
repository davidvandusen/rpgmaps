const BaseTerrain = require('./BaseTerrain');
const {rgbaToCss} = require('../common/color');

class CloseUpRiver extends BaseTerrain {
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
        const lightenAmt = Math.floor(this.rng() * 10);
        const red = 132 + lightenAmt;
        const green = 184 + lightenAmt;
        const blue = 204 + lightenAmt;
        gradient.addColorStop(0, rgbaToCss(red, green, blue, 180));
        gradient.addColorStop(1, rgbaToCss(red, green, blue, 0));
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      });
      this.ctx.restore();
      resolve();
    });
  }

  overlay() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}

module.exports = CloseUpRiver;
