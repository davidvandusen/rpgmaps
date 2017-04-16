import BaseTerrain from './BaseTerrain';

class CloseUpRoad extends BaseTerrain {
  base() {
    this.ctx.save();
    this.ctx.beginPath();
    this.drawPolyPath(this.smoothOutlineShape);
    this.ctx.clip('evenodd');
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = 'rgba(217,200,179,1)';
    this.ctx.fill();
    this.ctx.restore();
  }

  overlay() {
  }
}

export default CloseUpRoad;
