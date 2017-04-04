import {outline} from '../common/imageDataCommon';
import seedrandom from 'seedrandom';

const baseColors = [
  '#e0dac4',
  '#dccab2',
  '#e6d2b7',
  '#d9c8b3',
  '#d7ceb2'
];

function closeUpRoad(mask, ctx) {
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
  const points = outline(mask);
  ctx.beginPath();
  const [x, y] = mask.coords(points[0]);
  ctx.moveTo(x * scaleFactorX, y * scaleFactorY);
  for (let i = 1; i < points.length; i++) {
    const [x, y] = mask.coords(points[i]);
    ctx.lineTo(x * scaleFactorX, y * scaleFactorY);
  }
  ctx.closePath();
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 3;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();
}

export default closeUpRoad;
