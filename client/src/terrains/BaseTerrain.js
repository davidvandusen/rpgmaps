const {distance} = require('../common/geometry');

class BaseTerrain {
  constructor(mapData, areaIndex, ctx, rng) {
    this.mapData = mapData;
    this.areaIndex = areaIndex;
    const area = mapData.areas[areaIndex];
    this.mask = area.mask;
    this.outline = mapData.outlines[areaIndex];
    this.outlineShape = [this.outline, ...area.contains.map(outlineIndex => mapData.outlines[outlineIndex])];
    this.smoothOutline = mapData.smoothOutlines[areaIndex];
    this.smoothOutlineShape = [this.smoothOutline, ...area.contains.map(outlineIndex => mapData.smoothOutlines[outlineIndex])];
    this.ctx = ctx;
    this.rng = rng;
    this.scaleFactorX = ctx.canvas.width / area.mask.width;
    this.scaleFactorY = ctx.canvas.height / area.mask.height;
  }

  getBounds() {
    if (this.bounds) return this.bounds;
    let [minX, minY] = this.outline[0];
    let [maxX, maxY] = this.outline[0];
    for (let i = 1; i < this.outline.length; i++) {
      const [x, y] = this.outline[i];
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
    return this.bounds = {minX, minY, maxX, maxY};
  }

  getMinX() {
    if (this.minX) return this.minX;
    return this.minX = this.getBounds().minX;
  }

  getMinY() {
    if (this.minY) return this.minY;
    return this.minY = this.getBounds().minY;
  }

  getMaxX() {
    if (this.maxX) return this.maxX;
    return this.maxX = this.getBounds().maxX;
  }

  getMaxY() {
    if (this.maxY) return this.maxY;
    return this.maxY = this.getBounds().maxY;
  }

  getCenter() {
    if (this.center) return this.center;
    this.centerX = (this.getMinX() + this.getMaxX()) / 2;
    this.centerY = (this.getMinY() + this.getMaxY()) / 2;
    return this.center = [this.centerX, this.centerY]
  }

  getWidth() {
    if (this.width) return this.width;
    return this.width = this.getMaxX() - this.getMinX();
  }

  getHeight() {
    if (this.height) return this.height;
    return this.height = this.getMaxY() - this.getMinY();
  }

  drawPath(points) {
    for (let i = 0; i < points.length; i++) {
      this.ctx[i === 0 ? 'moveTo' : 'lineTo'](points[i][0] * this.scaleFactorX, points[i][1] * this.scaleFactorY);
    }
  }

  drawPolyPath(paths) {
    for (let i = 0; i < paths.length; i++) {
      this.drawPath(paths[i]);
    }
  }

  clipShape(shape) {
    this.ctx.beginPath();
    this.drawPolyPath(shape);
    this.ctx.clip('evenodd');
  }

  fillShape(shape, color) {
    this.clipShape(shape);
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  drawIrregularCircle(x, y, r, jitterAmount, segments) {
    let theta = 0;
    const t = 2 * Math.PI;
    const segmentAngle = t / segments;
    do {
      const l = r * (1 - jitterAmount) + this.rng() * r * 2 * jitterAmount;
      const x1 = x + l * Math.cos(theta);
      const y1 = y + l * Math.sin(theta);
      if (theta === 0) this.ctx.moveTo(x1, y1);
      else this.ctx.lineTo(x1, y1);
      theta += segmentAngle;
    } while (theta < t);
  }

  drawJitterPath(points, segmentation, angleJitter, connected = false) {
    for (let p = 0; p < points.length; p++) {
      const toX = points[p][0] * this.scaleFactorX;
      const toY = points[p][1] * this.scaleFactorY;
      if (p === 0) {
        this.ctx.moveTo(toX, toY);
      } else {
        const from = points[p - 1];
        let fromX = from[0] * this.scaleFactorX;
        let fromY = from[1] * this.scaleFactorY;
        const theta = Math.atan2(fromY - toY, fromX - toX);
        let segments = Math.ceil(this.rng() * segmentation + segmentation / 2);
        const segmentLength = distance(fromX, fromY, toX, toY) / segments;
        while (segments--) {
          const newTheta = theta + (this.rng() - 0.5) * angleJitter;
          const newX = fromX + Math.cos(newTheta) * segmentLength;
          const newY = fromY + Math.sin(newTheta) * segmentLength;
          this.ctx.lineTo(newX, newY);
          fromX = newX;
          fromY = newY;
        }
        if (connected) this.ctx.lineTo(toX, toY);
        else this.ctx.moveTo(toX, toY);
      }
    }
  }

  base() {
    return Promise.resolve();
  }

  overlay() {
    return Promise.resolve();
  }

}

module.exports = BaseTerrain;
