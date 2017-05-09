const BaseTerrain = require('./BaseTerrain');

class Boulder extends BaseTerrain {
  base() {
    return new Promise((resolve, reject) => {
      this.ctx.save();
      this.ctx.translate(this.scaleFactorX, this.scaleFactorY);
      this.fillShape(this.smoothOutlineShape, 'rgba(0,0,0,0.2');
      this.ctx.restore();
      resolve();
    });
  }

  overlay() {
    return new Promise((resolve, reject) => {
      this.ctx.save();
      this.fillShape(this.smoothOutlineShape, '#c6c1c3');
      this.ctx.restore();
      this.ctx.save();
      this.drawPolyPath(this.smoothOutlineShape);
      this.ctx.closePath();
      this.ctx.strokeStyle = '#636059';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.restore();
      resolve();
    });
  }
}

module.exports = Boulder;
