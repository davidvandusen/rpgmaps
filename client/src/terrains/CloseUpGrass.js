const BaseTerrain = require('./BaseTerrain');
const {rgbaToCss} = require('../common/color');
const {distance} = require('../common/geometry');

class CloseUpGrass extends BaseTerrain {
  base() {
    this.mask.forEach((x, y, i) => {
      if (x % 2 || y % 2) return;
      const x0 = (x + 1) * this.scaleFactorX + (this.rng() * this.scaleFactorX - this.scaleFactorX * 0.5);
      const y0 = (y + 1) * this.scaleFactorY + (this.rng() * this.scaleFactorY - this.scaleFactorY * 0.5);
      const r1 = 4 * this.scaleFactorX + (this.rng() * this.scaleFactorX);
      const gradient = this.ctx.createRadialGradient(x0, y0, 0, x0, y0, r1);
      const yellowAmt = Math.floor(this.rng() * 40);
      const red = 176 + yellowAmt / 2;
      const green = 188 + yellowAmt / 3;
      const blue = 148 + yellowAmt / 4;
      gradient.addColorStop(0, rgbaToCss(red, green, blue, 255));
      gradient.addColorStop(1, rgbaToCss(red, green, blue, 0));
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    });
  }

  overlay() {
    const drawJitterPath = (points, segmentation, angleJitter) => {
      this.ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const toX = points[i][0] * this.scaleFactorX;
        const toY = points[i][1] * this.scaleFactorY;
        if (i !== 0) {
          const from = points[i - 1];
          let fromX = from[0] * this.scaleFactorX;
          let fromY = from[1] * this.scaleFactorY;
          const theta = Math.atan2(fromY - toY, fromX - toX);
          const segments = this.rng() * segmentation + segmentation;
          const segmentLength = distance(fromX, fromY, toX, toY) / segments;
          for (let i = 0; i < segments; i++) {
            const newTheta = theta + (this.rng() - 0.5) * angleJitter;
            const newX = fromX + Math.cos(newTheta) * segmentLength;
            const newY = fromY + Math.sin(newTheta) * segmentLength;
            this.ctx.lineTo(newX, newY);
            fromX = newX;
            fromY = newY;
          }
        }
        this.ctx.moveTo(toX, toY);
      }
      this.ctx.stroke();
    };

    const drawVerticalStrips = (points, segmentation, angleJitter, stripLength, lengthJitter, tiltFactor) => {
      this.ctx.beginPath();
      for (let i = 1; i < points.length; i++) {
        const toX = points[i][0] * this.scaleFactorX;
        const toY = points[i][1] * this.scaleFactorY;
        const from = points[i - 1];
        let fromX = from[0] * this.scaleFactorX;
        let fromY = from[1] * this.scaleFactorY;
        const theta = Math.atan2(fromY - toY, fromX - toX);
        const segments = this.rng() * segmentation + segmentation;
        const segmentLength = distance(fromX, fromY, toX, toY) / segments;
        for (let i = 0; i < segments; i++) {
          const newTheta = theta + (this.rng() - 0.5) * angleJitter;
          const newX0 = fromX + Math.cos(newTheta) * segmentLength * i;
          const newY0 = fromY + Math.sin(newTheta) * segmentLength;
          this.ctx.moveTo(newX0, newY0);
          const newX1 = newX0 + (this.rng() - 0.5) * this.scaleFactorX * tiltFactor;
          const newY1 = newY0 - stripLength + this.rng() * stripLength * lengthJitter;
          this.ctx.lineTo(newX1, newY1);
        }
      }
      this.ctx.stroke();
    };

    const overlayGrass = [];
    this.mask.forEach((x, y) => {
      if (this.rng() > 0.005) return;
      overlayGrass.push([[x - 1.5, y + 0.5], [x + 1.5 + this.rng() * 2, y + 0.5]]);
    });

    const grassBlades = [];
    this.mask.forEach((x, y) => {
      if (this.rng() > 0.03) return;
      grassBlades.push([[x - 1.5, y + 0.5], [x + 1.5 + this.rng() * 2, y + 0.5]]);
    });

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = 1;

    this.ctx.strokeStyle = '#252106';
    this.smoothOutlineShape.forEach(path => drawJitterPath(path, 5, Math.PI));

    this.ctx.save();
    this.drawShape(this.smoothOutlineShape);
    this.ctx.strokeStyle = '#45512c';
    overlayGrass.forEach(path => drawJitterPath(path, 10, 1.1));
    grassBlades.forEach(path => drawVerticalStrips(path, 6, 0.7, this.scaleFactorY * 0.75, 0.95, 0.5));
    this.ctx.restore();
  }
}

module.exports = CloseUpGrass;
