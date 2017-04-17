import BaseTerrain from './BaseTerrain';

class CloseUpRoad extends BaseTerrain {
  base() {
    this.ctx.save();
    this.fillShape(this.smoothOutlineShape, 'rgba(217,200,179,1)');
    this.ctx.restore();
  }

  overlay() {
  }
}

export default CloseUpRoad;
