const BaseTerrain = require('./BaseTerrain');

class FlowingLava extends BaseTerrain {
  base() {
    return new Promise((resolve, reject) => {
      this.ctx.save();
      this.fillShape(this.smoothOutlineShape, '#e6403c');
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

module.exports = FlowingLava;
