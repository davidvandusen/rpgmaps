import {detectAreas} from './common/imageDataCommon';
import {intToCssHex} from './common/colorCommon';
import * as terrainProcs from './terrains';

const READY = 0;
const PROCESSING = 1;

export default class OutputMap {
  constructor(el, config) {
    this.el = el;
    this.config = config;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.config.output.canvas.resolution.width;
    this.canvas.height = this.config.output.canvas.resolution.height;
    this.ctx = this.canvas.getContext('2d');
    this.areas = [];
    this.status = READY;
  }

  drawGrid() {
    const gridSpacing = this.canvas.width / 32;
    this.ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    this.ctx.lineWidth = 1;
    this.ctx.lineJoin = 'miter';
    this.ctx.lineCap = 'butt';
    this.ctx.setLineDash([]);
    for (let i = gridSpacing; i < this.canvas.width; i += gridSpacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvas.height);
      this.ctx.stroke();
    }
    for (let i = gridSpacing; i < this.canvas.height; i += gridSpacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.canvas.width, i);
      this.ctx.stroke();
    }
  }

  drawBorder() {
    const borderWidth = this.canvas.width / 64;

    this.ctx.fillStyle = '#cab9a3';
    this.ctx.fillRect(borderWidth, 0, this.canvas.width - 2 * borderWidth, borderWidth);
    this.ctx.fillRect(0, borderWidth, borderWidth, this.canvas.height - 2 * borderWidth);
    this.ctx.fillRect(borderWidth, this.canvas.height - borderWidth, this.canvas.width - 2 * borderWidth, borderWidth);
    this.ctx.fillRect(this.canvas.width - borderWidth, borderWidth, borderWidth, this.canvas.height - 2 * borderWidth);

    this.ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(borderWidth - 2, borderWidth - 2, this.canvas.width - 2 * borderWidth + 4, this.canvas.height - 2 * borderWidth + 4);
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(borderWidth - 8, borderWidth - 8, this.canvas.width - 2 * borderWidth + 16, this.canvas.height - 2 * borderWidth + 16);
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#e0d088';
    this.ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.rect(0, 0, borderWidth, borderWidth);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.rect(this.canvas.width - borderWidth, 0, borderWidth, borderWidth);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.rect(0, this.canvas.height - borderWidth, borderWidth, borderWidth);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.rect(this.canvas.width - borderWidth, this.canvas.height - borderWidth, borderWidth, borderWidth);
    this.ctx.fill();
    this.ctx.stroke();
  }

  draw() {
    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        this.ctx.fillStyle = this.config.output.canvas.color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.areas.forEach(area => area.proc(area.mask, this.ctx));
        this.drawGrid();
        this.drawBorder();
        resolve();
      });
    });
  }

  updateCanvasSize() {
    this.scaleFactor = this.el.offsetWidth / this.config.output.canvas.resolution.width;
    this.canvas.style.height = (this.config.output.canvas.resolution.height * this.scaleFactor) + 'px';
    this.canvas.style.width = this.el.offsetWidth + 'px';
    this.draw();
  }

  init() {
    window.addEventListener('resize', this.updateCanvasSize.bind(this));
    this.updateCanvasSize();
    this.el.appendChild(this.canvas);
    this.draw();
    if (typeof this.onInit === 'function') this.onInit();
  }

  setInput(imageData) {
    this.nextInput = imageData;
    this.processInput();
  }

  getTerrainFromArea(area) {
    const configTerrains = this.config.mapTypes[0].terrains;
    const cssHex = intToCssHex(area.color);
    return configTerrains.find(terrain => terrain.color === cssHex);
  }

  updateAreas() {
    return detectAreas(this.input).then(areas => {
      return this.areas = areas.map(area => {
        const terrain = this.getTerrainFromArea(area);
        return {
          layer: terrain.layer,
          mask: area.mask,
          proc: terrainProcs[terrain.procName]
        };
      }).sort((areaA, areaB) => areaA.layer - areaB.layer);
    });
  }

  processInput() {
    if (this.status !== READY) return;
    this.status = PROCESSING;
    this.input = this.nextInput;
    this.nextInput = undefined;
    this.updateAreas()
      .then(this.draw.bind(this))
      .then(() => {
        this.status = READY;
        if (this.nextInput) setTimeout(this.processInput.bind(this), 0);
      });
  }
}
