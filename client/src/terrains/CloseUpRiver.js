const BaseTerrain = require('./BaseTerrain');

class CloseUpRiver extends BaseTerrain {
  base() {
    this.ctx.save();
    this.fillShape(this.smoothOutlineShape, 'rgba(142,194,214,1)');
    this.ctx.restore();
  }

  overlay() {
  }
}

module.exports = CloseUpRiver;
