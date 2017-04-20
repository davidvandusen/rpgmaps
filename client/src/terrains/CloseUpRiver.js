const BaseTerrain = require('./BaseTerrain');

class CloseUpRiver extends BaseTerrain {
  base() {
    return new Promise((resolve, reject) => {
      this.ctx.save();
      this.fillShape(this.smoothOutlineShape, 'rgba(142,194,214,1)');
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
