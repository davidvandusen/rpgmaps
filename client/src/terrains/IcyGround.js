const BaseTerrain = require('./BaseTerrain');

class IcyGround extends BaseTerrain {
  base() {
    return new Promise((resolve, reject) => {
      this.ctx.save();
      this.fillShape(this.smoothOutlineShape, '#cee5eb');
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

module.exports = IcyGround;
