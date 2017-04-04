import {outlineMask, smoothOutline} from '../common/imageDataCommon';
import seedrandom from 'seedrandom';

const baseColors = [
  'rgb(224,218,196)',
  'rgb(220,202,178)',
  'rgb(230,210,183)',
  'rgb(217,200,179)',
  'rgb(215,206,178)'
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

  const outline = smoothOutline(outlineMask(mask), 2);

  ctx.beginPath();
  for (let i = 0; i < outline.length; i++) {
    ctx[i === 0 ? 'moveTo' : 'lineTo'](outline[i][0] * scaleFactorX, outline[i][1] * scaleFactorY);
  }
  ctx.fillStyle = 'rgba(217,200,179,0.2)';
  ctx.globalCompositeOperation = 'screen';
  ctx.fill();

  ctx.globalCompositeOperation = 'multiply';
  ctx.strokeStyle = 'rgba(0,0,0,0.125)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.globalCompositeOperation = 'source-over';
}

export default closeUpRoad;
