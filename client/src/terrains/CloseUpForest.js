const BaseTerrain = require('./BaseTerrain');
const {distance} = require('../common/geometry');

class CloseUpForest extends BaseTerrain {
  makeLeafyOutlineShape(shape, boughJitter, segmentation) {
    return shape.map((path, pathIndex) => {
      let src = path[path.length - 1];
      return path.reduce((newPath, dst) => {
        const outlineSegment = [];
        const diameter = distance(src[0], src[1], dst[0], dst[1]);
        const radius = diameter / 2;
        const numSegments = segmentation * radius;
        const thetaSrcDst = Math.atan2(dst[1] - src[1], dst[0] - src[0]);
        const centerX = src[0] + radius * Math.cos(thetaSrcDst);
        const centerY = src[1] + radius * Math.sin(thetaSrcDst);
        const angleChange = (pathIndex === 0) ? Math.PI / numSegments : -Math.PI / numSegments;
        const thetaDstSrc = thetaSrcDst - Math.PI;
        for (let segment = 0; segment < numSegments; segment++) {
          const angle = thetaDstSrc + angleChange * segment;
          const r = radius + (this.rng() - 0.5) * boughJitter;
          outlineSegment.push([
            centerX + r * Math.cos(angle),
            centerY + r * Math.sin(angle)
          ]);
        }
        src = dst;
        return newPath.concat(outlineSegment);
      }, []);
    });
  }

  makeSparseShape(shape, maxPointsToSkip, p0, p1) {
    return shape.map((path, pathIndex) => {
      if (path.length < 20) return path;
      const p = pathIndex === 0 ? p0 : p1;
      let numSkipped = 0;
      return path.filter(() => {
        if (numSkipped >= maxPointsToSkip) {
          numSkipped = 0;
          return true;
        }
        const skip = this.rng() >= p;
        if (skip) numSkipped++;
        return !skip;
      });
    });
  }

  base() {
    return new Promise((resolve, reject) => {
      const shape = this.makeSparseShape(this.smoothOutlineShape, 4, 0.5, 0.8);
      this.leafyOutlineShape = this.makeLeafyOutlineShape(shape, 0.3, 8);

      this.ctx.save();
      this.ctx.translate(this.scaleFactorX, this.scaleFactorY);
      this.fillShape(this.leafyOutlineShape, 'rgba(0,0,0,0.2');
      this.ctx.restore();

      resolve();
    });
  }

  overlay() {
    return new Promise((resolve, reject) => {
      this.ctx.save();
      const bounds = this.getBounds();
      const width = this.getWidth();
      const height = this.getHeight();
      const gradient = this.ctx.createRadialGradient(
        bounds.minX * this.scaleFactorX,
        bounds.minY * this.scaleFactorY,
        0,
        bounds.minX * this.scaleFactorX,
        bounds.minY * this.scaleFactorY,
        width > height ? width * this.scaleFactorX * 1.25: height * this.scaleFactorY * 1.25);
      gradient.addColorStop(0, 'rgba(153,170,116,1)');
      gradient.addColorStop(0.5, 'rgba(95,118,73,1)');
      gradient.addColorStop(0.75, 'rgba(67,92,62,1)');
      gradient.addColorStop(1, 'rgba(31,44,34,1)');

      this.fillShape(this.leafyOutlineShape, gradient);

      this.leafyOutlineShape.forEach(path => {
        this.drawPath(path);
      });
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.miterLimit = 3;
      this.ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      this.ctx.lineWidth = this.scaleFactorX * 0.5;
      this.ctx.stroke();
      this.ctx.restore();

      this.leafyOutlineShape.forEach(path => {
        this.drawPath(path);
      });
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.miterLimit = 3;
      this.ctx.strokeStyle = '#1d270c';
      this.ctx.lineWidth = this.scaleFactorX * 0.2;
      this.ctx.stroke();

      resolve();
    });
  }
}

module.exports = CloseUpForest;
