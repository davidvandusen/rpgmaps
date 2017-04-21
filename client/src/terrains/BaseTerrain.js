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

  drawShape(shape) {
    this.ctx.beginPath();
    this.drawPolyPath(shape);
    this.ctx.clip('evenodd');
  }

  fillShape(shape, color) {
    this.drawShape(shape);
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

  base() {
    return Promise.resolve();
  }

  overlay() {
    return Promise.resolve();
  }

}

module.exports = BaseTerrain;
