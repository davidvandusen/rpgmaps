import BaseTerrain from './BaseTerrain';

class CloseUpForest extends BaseTerrain {
  constructor(mask, ctx) {
    super(mask, ctx);
    this.baseColor = 'rgba(57,75,45,1)';
  }

  overlay() {
  }
}

export default CloseUpForest;
