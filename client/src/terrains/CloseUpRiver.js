const BaseTerrain = require('./BaseTerrain');

class CloseUpRiver extends BaseTerrain {
  base() {
    return new Promise((resolve, reject) => {
      this.ctx.save();
      this.clipShape(this.smoothOutlineShape);
      this.ctx.fillStyle = 'rgb(132,184,204)';
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.strokeStyle = 'rgba(234,214,162, 0.2)';
      this.ctx.lineWidth = this.scaleFactorX * 2.5;
      this.smoothOutlineShape.forEach(path => {
        this.ctx.beginPath();
        this.drawPath(path);
        this.ctx.closePath();
        this.ctx.stroke();
      });
      this.ctx.lineWidth = this.scaleFactorX * 1.5;
      this.smoothOutlineShape.forEach(path => {
        this.ctx.beginPath();
        this.drawPath(path);
        this.ctx.closePath();
        this.ctx.stroke();
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
