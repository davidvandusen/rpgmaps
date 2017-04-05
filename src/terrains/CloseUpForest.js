import {rgbaToCss} from '../common/colorCommon';
import {distance} from '../common/geometryCommon';
import BaseTerrain from './BaseTerrain';

class CloseUpForest extends BaseTerrain {
  constructor(mask, ctx) {
    super(mask, ctx);
  }

  drawTree(x, y, r) {
    this.ctx.beginPath();
    this.ctx.arc(x * this.scaleFactorX, y * this.scaleFactorY, r * this.scaleFactorX, 0, 2 * Math.PI);
    this.ctx.closePath();
    const colorJitter = 16;
    const red = Math.floor(57 + this.rng() * colorJitter - colorJitter / 2);
    const green = Math.floor(75 + this.rng() * colorJitter - colorJitter / 2);
    const blue = Math.floor(45 + this.rng() * colorJitter - colorJitter / 2);
    this.ctx.fillStyle = rgbaToCss(red, green, blue, 255);
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  overlay() {
    const outline = this.getOutline();
    let i = 0;
    let rNext = 2;
    let rLast;
    const edgeTrees = [];
    while (i < outline.length) {
      const [x, y] = outline[i];
      edgeTrees.push([x, y, rNext]);
      rLast = rNext;
      do i += Math.floor(this.rng() * 4);
      while (outline[i] && (rNext = distance(x, y, ...outline[i]) - rLast) < 1);
    }
    const innerTrees = [];
    const numToAvg = 2;
    for (let i = 0, len = edgeTrees.length; i < len; i++) {
      let sx = 0;
      let sy = 0;
      let sr = 0;
      for (let t = Math.floor(i - numToAvg / 2); t < Math.floor(i + numToAvg / 2); t++) {
        const index = t < 0 ? edgeTrees.length + t : t >= edgeTrees.length ? t - edgeTrees.length : t;
        sx += edgeTrees[index][0];
        sy += edgeTrees[index][1];
        sr += edgeTrees[index][2];
      }
      innerTrees.push([sx / numToAvg, sy / numToAvg, sr / numToAvg]);
    }
    for (let i = 0; i < innerTrees.length; i++) this.drawTree(...innerTrees[i]);
    for (let i = 0; i < edgeTrees.length; i++) this.drawTree(...edgeTrees[i]);
  }
}

export default CloseUpForest;
