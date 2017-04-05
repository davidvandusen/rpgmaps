import BaseTerrain from './BaseTerrain';

class CloseUpRoad extends BaseTerrain {
  constructor(mask, ctx) {
    super(mask, ctx);
    this.baseColor = 'rgba(217,200,179,1)';
  }

  overlay() {
    this.ctx.beginPath();
    this.drawPath(this.getSmoothOutline());
    this.ctx.strokeStyle = 'rgba(0,0,0,0.125)';
    this.ctx.lineWidth = 1;
    this.ctx.globalCompositeOperation = 'multiply';
    this.ctx.stroke();
    this.ctx.globalCompositeOperation = 'source-over';
  }
}

export default CloseUpRoad;
