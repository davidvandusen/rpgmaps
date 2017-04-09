import BaseTerrain from './BaseTerrain';

class CloseUpGrass extends BaseTerrain {
  constructor(mask, ctx, rng) {
    super(mask, ctx, rng);
    this.baseColor = 'rgba(212,214,164,1)';
  }

  overlay() {
  }
}

export default CloseUpGrass;
