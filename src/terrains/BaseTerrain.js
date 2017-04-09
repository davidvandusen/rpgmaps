import {outlineMask, smoothPolygon} from '../lib/geometryCommon';

class BaseTerrain {
  constructor(mask, ctx, rng) {
    this.mask = mask;
    this.ctx = ctx;
    this.rng = rng;
    this.scaleFactorX = ctx.canvas.width / mask.width;
    this.scaleFactorY = ctx.canvas.height / mask.height;
    this.baseColor = 'rgba(0,0,0,1)';
  }

  getOutline() {
    if (this.outline) return this.outline;
    return this.outline = outlineMask(this.mask);
  }

  getSmoothOutline() {
    if (this.smoothOutline) return this.smoothOutline;
    return this.smoothOutline = smoothPolygon(this.getOutline(), 2);
  }

  getBounds() {
    if (this.bounds) return this.bounds;
    const outline = this.getOutline();
    let [minX, minY] = outline[0];
    let [maxX, maxY] = outline[0];
    for (let i = 1; i < outline.length; i++) {
      const [x, y] = outline[i];
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
    this.ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      this.ctx[i === 0 ? 'moveTo' : 'lineTo'](points[i][0] * this.scaleFactorX, points[i][1] * this.scaleFactorY);
    }
    this.ctx.closePath();
  }

  base() {
    this.drawPath(this.getSmoothOutline());
    this.ctx.fillStyle = this.baseColor;
    this.ctx.fill();
  }

  overlay() {}

}

export default BaseTerrain;
