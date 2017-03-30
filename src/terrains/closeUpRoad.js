import {isBitActiveInBytes, coordsFromDataPoint, outlinePoints} from '../common/imageDataCommon';
import seedrandom from 'seedrandom';

const baseColors = [
  '#e0dac4',
  '#dccab2',
  '#e6d2b7',
  '#d9c8b3',
  '#d7ceb2'
];

function closeUpRoad(srcData, srcWidth, srcHeight, dstWidth, dstHeight, ctx) {
  const rng = seedrandom('');
  const scaleFactorX = dstWidth / srcWidth;
  const scaleFactorY = dstHeight / srcHeight;
  for (let index = 0; index < srcData.length * 8; index++) {
    if (isBitActiveInBytes(index, srcData)) {
      const [srcX, srcY] = coordsFromDataPoint(index, srcWidth);
      const dstX = srcX * scaleFactorX;
      const dstY = srcY * scaleFactorY;
      ctx.fillStyle = baseColors[Math.floor(rng() * baseColors.length)];
      ctx.fillRect(dstX, dstY, scaleFactorX, scaleFactorY);
    }
  }
  const points = outlinePoints(srcData, srcWidth);
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
