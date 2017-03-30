import seedrandom from 'seedrandom';

const baseColors = [
  '#d4d6a4',
  '#c9ce98',
  '#d7deaa',
  '#cfd599',
  '#c4cc97'
];

function closeUpGrass(mask, ctx) {
  const rng = seedrandom('');
  const scaleFactorX = ctx.canvas.width / mask.width;
  const scaleFactorY = ctx.canvas.height / mask.height;
  for (let index = 0; index < mask.size; index++) {
    if (mask.get(index)) {
      const [srcX, srcY] = mask.coords(index);
      const dstX = srcX * scaleFactorX;
      const dstY = srcY * scaleFactorY;
      ctx.fillStyle = baseColors[Math.floor(rng() * baseColors.length)];
      ctx.fillRect(dstX, dstY, scaleFactorX, scaleFactorY);
    }
  }
}

export default closeUpGrass;
