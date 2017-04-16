const assert = require('assert');
const geometry = require('../src/common/geometry');

describe('geometry', function () {

  describe('contains', function () {

    const polygon = [[1, 1], [3, 1], [3, 3], [1, 3]];

    const pointsContained = [];

    for (let x = 1; x <= 3; x++) {
      for (let y = 1; y <= 3; y++) {
        pointsContained.push([x, y]);
      }
    }

    pointsContained.forEach(point => {
      it(`returns true for point ${point} which is inside or on the boundary`, function () {
        assert(geometry.contains(polygon, ...point));
      });
    });

  });

});
