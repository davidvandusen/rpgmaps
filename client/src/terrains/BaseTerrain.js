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

  base() {}

  overlay() {}

}

export default BaseTerrain;
