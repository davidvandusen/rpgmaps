import BaseTerrain from './BaseTerrain';

class CloseUpRiver extends BaseTerrain {
  base() {
    this.ctx.save();
    this.ctx.beginPath();
    this.drawPolyPath(this.smoothOutlineShape);
    this.ctx.clip('evenodd');
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillStyle = 'rgba(142,194,214,1)';
    this.ctx.fill();
    this.ctx.restore();
  }

  overlay() {
  }
}

export default CloseUpRiver;
