import {pointInCircle, distance} from '../common/geometry';
import {rgbaToCss} from '../common/color';
import BaseTerrain from './BaseTerrain';

class CloseUpForest extends BaseTerrain {
  constructor(mask, ctx, rng) {
    super(mask, ctx, rng);
    this.baseColor = 'rgba(27,45,15,1)';
  }

  base() {
    this.ctx.shadowBlur = 25;
    this.ctx.shadowOffsetX = 10;
    this.ctx.shadowOffsetY = 5;
    this.ctx.shadowColor = 'rgba(0,0,0,1)';
    BaseTerrain.prototype.base.call(this);
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowColor = 'rgba(0,0,0,0)';
  }

  drawTree(x, y, r) {
    (() => {
      this.ctx.beginPath();
      let theta = 0;
      while (theta < 2 * Math.PI) {
        const spiralX = (x + (this.rng() * r * 0.3 + r * 0.7) * Math.cos(theta)) * this.scaleFactorX;
        const spiralY = (y + (this.rng() * r * 0.3 + r * 0.7) * Math.sin(theta)) * this.scaleFactorY;
        this.ctx[theta === 0 ? 'moveTo' : 'lineTo'](spiralX, spiralY);
        theta += 0.4;
      }
      this.ctx.closePath();
      const colorJitter = 16;
      const red = Math.floor(47 + this.rng() * colorJitter - colorJitter / 2);
      const green = Math.floor(65 + this.rng() * colorJitter - colorJitter / 2);
      const blue = Math.floor(35 + this.rng() * colorJitter - colorJitter / 2);
      const gradient = this.ctx.createRadialGradient(x * this.scaleFactorX, y * this.scaleFactorY, 0, x * this.scaleFactorX, y * this.scaleFactorY, r * this.scaleFactorX);
      gradient.addColorStop(0, rgbaToCss(red, green, blue, 255));
      gradient.addColorStop(0.5, rgbaToCss(red, green, blue, 255));
      gradient.addColorStop(0.7, rgbaToCss(red - 10, green - 10, blue - 10, 225));
      gradient.addColorStop(0.9, rgbaToCss(0, 0, 0, 0));
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    })();

    (() => {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.scaleFactorX, y * this.scaleFactorY);
      let spiralRadius = 0;
      let theta = 0;
      let spiralRate = 0.05;
      while (spiralRadius < r * 0.85) {
        const spiralX = (x + spiralRadius * Math.cos(theta)) * this.scaleFactorX + (this.rng() - 0.5) * 0.5 * this.scaleFactorX;
        const spiralY = (y + spiralRadius * Math.sin(theta)) * this.scaleFactorY + (this.rng() - 0.5) * 0.5 * this.scaleFactorY;
        this.ctx.lineTo(spiralX, spiralY);
        theta += 0.5;
        spiralRadius += spiralRate;
        spiralRate = Math.max(spiralRate - 0.0002, 0.01);
      }
      this.ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    })();
  }

  getEdgeTrees(outline) {
    const edgeTrees = [];
    let i = 0;
    let rNext = 2;
    let rLast;
    while (i < outline.length) {
      const [x, y] = outline[i];
      edgeTrees.push([x, y, rNext]);
      rLast = rNext;
      do i += Math.floor(this.rng() * 4);
      while (outline[i] && (rNext = distance(x, y, ...outline[i]) - rLast) < 1);
    }
    return edgeTrees;
  }

  overlay() {
    this.getEdgeTrees(this.outline).forEach(tree => this.drawTree(...tree));
    const trees = [];
    this.mask.forEach((x, y) => {
      if (this.rng() < 0.001) trees.push([x, y, this.rng() * 2.5 + 5]);
      if (this.rng() < 0.17) trees.push([x, y, this.rng() * 2.5 + 1.25]);
    });
    trees.sort((treeA, treeB) => treeA[2] - treeB[2]).forEach(tree => this.drawTree(...tree));
  }
}

export default CloseUpForest;
