import {isBitActiveInBytes, coordsFromDataPoint} from '../common/imageDataCommon';
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
      ctx.beginPath();
      ctx.arc(dstX + scaleFactorX * 0.5 * rng() , dstY + scaleFactorY * 0.5 * rng(), scaleFactorX * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = baseColors[Math.floor(rng() * baseColors.length)];
      ctx.fill();
    }
  }
}

export default closeUpRoad;
