import seedrandom from 'seedrandom';
import {outlineMask, smoothOutline} from '../common/imageDataCommon';

class BaseTerrain {
  constructor(mask, ctx) {
    this.mask = mask;
    this.ctx = ctx;
    this.rng = seedrandom('');
    this.scaleFactorX = ctx.canvas.width / mask.width;
    this.scaleFactorY = ctx.canvas.height / mask.height;
    this.outline = outlineMask(this.mask);
    this.smoothOutline = smoothOutline(this.outline, 2);
    this.baseColor = 'rgba(0,0,0,1)';
  }

  base() {
    this.drawPath(this.smoothOutline);
    this.ctx.fillStyle = this.baseColor;
    this.ctx.fill();
  }

  overlay() {}

  drawPath(points) {
    this.ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      this.ctx[i === 0 ? 'moveTo' : 'lineTo'](points[i][0] * this.scaleFactorX, points[i][1] * this.scaleFactorY);
    }
    this.ctx.closePath();
  }

}

export default BaseTerrain;
