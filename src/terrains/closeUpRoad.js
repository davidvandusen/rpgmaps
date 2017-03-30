import {outlinePoints} from '../common/imageDataCommon';
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
  const points = outlinePoints(mask);
  ctx.beginPath();
  ctx.moveTo(points[0] * scaleFactorX, points[1] * scaleFactorY);
  for (let i = 2; i < points.length; i += 2) {
    ctx.lineTo(points[i] * scaleFactorX, points[i + 1] * scaleFactorY);
  }
  ctx.closePath();
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  ctx.lineWidth = 10;
  ctx.stroke();
}

export default closeUpRoad;
