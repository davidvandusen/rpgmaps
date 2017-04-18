const BaseTerrain = require('./BaseTerrain');

class CloseUpGrass extends BaseTerrain {
  base() {
    this.ctx.save();
    this.fillShape(this.outlineShape, '#ccbd9f');
    this.ctx.restore();
  }

  overlay() {
    const imageData = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

  }
}

module.exports = CloseUpGrass;
