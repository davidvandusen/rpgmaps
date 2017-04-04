import BaseTerrain from './BaseTerrain';

class CloseUpGrass extends BaseTerrain {
  constructor(mask, ctx) {
    super(mask, ctx);
    this.baseColor = 'rgba(212,214,164,1)';
  }

  overlay() {
  }
}

export default CloseUpGrass;
