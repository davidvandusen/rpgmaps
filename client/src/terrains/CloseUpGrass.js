import BaseTerrain from './BaseTerrain';

class CloseUpGrass extends BaseTerrain {
  base() {
    this.ctx.save();
    this.fillShape(this.smoothOutlineShape, 'rgba(212,214,164,1)');
    this.ctx.restore();
  }

  overlay() {
  }
}

export default CloseUpGrass;
