const BaseTerrain = require('./BaseTerrain');
const {rgbaToCss} = require('../common/color');

class SolidStone extends BaseTerrain {
  base() {
    return new Promise((resolve, reject) => {
      this.ctx.save();
      this.fillShape(this.smoothOutlineShape, '#5d534b');
      this.ctx.restore();
      resolve();
    });
  }

  overlay() {
    return new Promise((resolve, reject) => {
      this.ctx.save();
      this.clipShape(this.smoothOutlineShape);
      this.ctx.lineCap = 'round';
      this.smoothOutlineShape.forEach(path => {
        let lastPoint = path[path.length - 1];
        let lighten = 0;
        path.forEach(point => {
          this.ctx.beginPath();
          this.ctx.moveTo(lastPoint[0] * this.scaleFactorX, lastPoint[1] * this.scaleFactorY);
          this.ctx.lineTo(point[0] * this.scaleFactorX, point[1] * this.scaleFactorY);
          this.ctx.lineWidth = this.scaleFactorX * (2 + (this.rng() - 0.5) * 8);
          lighten = Math.min(64, Math.max(0, lighten + (this.rng() - 0.5) * 6));
          this.ctx.strokeStyle = rgbaToCss(93 + lighten, 83 + lighten * 0.7, 75 + lighten * 0.4, 255);
          this.ctx.stroke();
          lastPoint = point;
        });
      });
      this.ctx.restore();
      resolve();
    });
  }
}

module.exports = SolidStone;
