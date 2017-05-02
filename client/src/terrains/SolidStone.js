const BaseTerrain = require('./BaseTerrain');
const {rgbaToCss} = require('../common/color');

class SolidStone extends BaseTerrain {
  base() {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  overlay() {
    return new Promise((resolve, reject) => {
      this.ctx.save();
      this.fillShape(this.smoothOutlineShape, '#5d534b');
      this.drawLightCracks();
      this.drawWall();
      this.drawDarkCracks();
      this.ctx.restore();
      resolve();
    });
  }

  drawDarkCracks() {
    const darkCrackColor = 'rgba(0,0,0,0.4)';
    const darkCrackLength = 20;
    const darkCrackLineWidth = 1;
    const darkCrackAngleJitter = 1.5;
    const darkCrackSegmentation = 8;
    const darkCrackOccurrenceProbability = 0.01;

    const darkCracks = [];
    this.mask.forEach((x, y) => {
      if (this.rng() > darkCrackOccurrenceProbability) return;
      darkCracks.push([
        [x, y],
        [x + (this.rng() - 0.5) * darkCrackLength, y + (this.rng() - 0.5) * darkCrackLength]
      ]);
    });
    this.ctx.beginPath();
    darkCracks.forEach(path => this.drawJitterPath(path, darkCrackSegmentation, darkCrackAngleJitter));
    this.ctx.lineCap = 'square';
    this.ctx.lineWidth = darkCrackLineWidth;
    this.ctx.strokeStyle = darkCrackColor;
    this.ctx.stroke();
  }

  drawLightCracks() {
    const lightCrackColor = 'rgba(255,255,255,0.1)';
    const lightCrackLength = 40;
    const lightCrackLineWidth = 2;
    const lightCrackAngleJitter = 2;
    const lightCrackSegmentation = 14;
    const lightCrackOccurrenceProbability = 0.01;

    const lightCracks = [];
    this.mask.forEach((x, y) => {
      if (this.rng() > lightCrackOccurrenceProbability) return;
      lightCracks.push([
        [x, y],
        [x + (this.rng() - 0.5) * lightCrackLength, y + (this.rng() - 0.5) * lightCrackLength]
      ]);
    });
    this.ctx.beginPath();
    lightCracks.forEach(path => this.drawJitterPath(path, lightCrackSegmentation, lightCrackAngleJitter));
    this.ctx.lineCap = 'square';
    this.ctx.lineWidth = lightCrackLineWidth;
    this.ctx.strokeStyle = lightCrackColor;
    this.ctx.stroke();
  }

  drawWall() {
    const minWallLineWidth = 2;
    const maxWallLineWidth = 7;
    const maxWallDarkenAmount = 28;
    const minWallDarkenAmount = 10;
    const wallDarkenStepAmount = 7;
    this.ctx.lineCap = 'round';
    this.smoothOutlineShape.forEach(path => {
      let lastPoint = path[path.length - 1];
      let darken = (minWallDarkenAmount + maxWallDarkenAmount) / 2;
      path.forEach(point => {
        this.ctx.beginPath();
        this.ctx.moveTo(lastPoint[0] * this.scaleFactorX, lastPoint[1] * this.scaleFactorY);
        this.ctx.lineTo(point[0] * this.scaleFactorX, point[1] * this.scaleFactorY);
        this.ctx.lineWidth = this.scaleFactorX * (minWallLineWidth + (this.rng() - 0.5) * maxWallLineWidth);
        darken = Math.min(maxWallDarkenAmount, Math.max(minWallDarkenAmount, darken + (this.rng() - 0.5) * wallDarkenStepAmount));
        this.ctx.strokeStyle = rgbaToCss(93 - darken, 83 - darken * 0.7, 75 - darken * 0.4, 255);
        this.ctx.stroke();
        lastPoint = point;
      });
    });
  }
}

module.exports = SolidStone;
