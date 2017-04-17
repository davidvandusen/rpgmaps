import BaseTerrain from './BaseTerrain';

class CloseUpRiver extends BaseTerrain {
  base() {
    this.ctx.save();
    this.fillShape(this.smoothOutlineShape, 'rgba(142,194,214,1)');
    this.ctx.restore();
  }

  overlay() {
  }
}

export default CloseUpRiver;
