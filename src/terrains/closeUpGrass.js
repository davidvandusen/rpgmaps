import {isBitActiveInBytes, coordsFromDataPoint} from '../common/imageDataCommon';
import seedrandom from 'seedrandom';

const baseColors = [
  '#d4d6a4',
  '#c9ce98',
  '#d7deaa',
  '#cfd599',
  '#c4cc97'
];

function closeUpGrass(srcData, srcWidth, srcHeight, dstWidth, dstHeight, ctx) {
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
}

export default closeUpGrass;
