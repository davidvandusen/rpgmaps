import BaseTerrain from './BaseTerrain';

class CloseUpRiver extends BaseTerrain {
  constructor(mask, ctx) {
    super(mask, ctx);
    this.baseColor = 'rgba(142,194,214,1)';
  }

  overlay() {
  }
}

export default CloseUpRiver;
