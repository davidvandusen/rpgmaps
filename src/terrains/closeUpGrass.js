import {isBitActiveInBytes, coordsFromDataPoint} from '../common/imageDataCommon';
import {cssToRgba, rgbaToCss} from '../common/colorCommon';
import seedrandom from 'seedrandom';

const baseColors = [
  '#d4d6a4',
  '#c9ce98',
  '#d7deaa',
  '#cfd599',
  '#c4cc97'
];

const baseGradients = baseColors.map(color => ([color, rgbaToCss(...cssToRgba(color).slice(0, 3), 0)]));

const baseGradientSize = 4.5;

function closeUpGrass(srcData, srcWidth, srcHeight, dstWidth, dstHeight, ctx) {
  const rng = seedrandom('');
  const scaleFactorX = dstWidth / srcWidth;
  const scaleFactorY = dstHeight / srcHeight;
  const points = [];
  for (let index = 0; index < srcData.length * 8; index++) {
    if (isBitActiveInBytes(index, srcData)) {
      const [srcX, srcY] = coordsFromDataPoint(index, srcWidth);
      const dstX = srcX * scaleFactorX;
      const dstY = srcY * scaleFactorY;
      points.push([dstX, dstY]);
    }
  }
  points.sort(rng).forEach(point =>
    drawGrassGradient(
      point[0],
      point[1],
      scaleFactorX,
      scaleFactorY,
      baseGradients[Math.floor(rng() * baseGradients.length)],
      ctx
    ));
}

function drawGrassGradient(dstX, dstY, scaleFactorX, scaleFactorY, gradientColors, ctx) {
  const gradient = ctx.createRadialGradient(
    dstX + scaleFactorX / 2,
    dstY + scaleFactorY / 2,
    0,
    dstX + scaleFactorX / 2,
    dstY + scaleFactorY / 2,
    scaleFactorX * baseGradientSize
  );
  gradient.addColorStop(0, gradientColors[0]);
  gradient.addColorStop(1, gradientColors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(
    dstX - scaleFactorX * baseGradientSize,
    dstY - scaleFactorY * baseGradientSize,
    scaleFactorX + scaleFactorX * 2 * baseGradientSize,
    scaleFactorY + scaleFactorY * 2 * baseGradientSize
  );
}

export default closeUpGrass;
