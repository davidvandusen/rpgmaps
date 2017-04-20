const BaseTerrain = require('./BaseTerrain');

class CloseUpRoad extends BaseTerrain {
  base() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  overlay() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}

module.exports = CloseUpRoad;
