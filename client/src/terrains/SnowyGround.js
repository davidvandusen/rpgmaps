const BaseTerrain = require('./BaseTerrain');

class SnowyGround extends BaseTerrain {
  base() {
    return new Promise((resolve, reject) => {
      this.ctx.save();
      this.fillShape(this.smoothOutlineShape, '#f2f3fa');
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

module.exports = SnowyGround;
