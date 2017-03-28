import {detectAreas} from './common/imageDataCommon';
import {intToCssHex} from './common/colorCommon';
import * as terrains from './terrains';

class OutputMap {
  constructor(el, config) {
    this.el = el;
    this.config = config;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.config.output.canvas.resolution.width;
    this.canvas.height = this.config.output.canvas.resolution.height;
    this.ctx = this.canvas.getContext('2d');
    this.areas = [];
  }

  init() {
    window.addEventListener('resize', this.updateCanvasSize.bind(this));
    this.updateCanvasSize();
    this.el.appendChild(this.canvas);
    this.draw();
    if (typeof this.onInit === 'function') this.onInit();
  }

  updateCanvasSize() {
    this.scaleFactor = this.el.offsetWidth / this.config.output.canvas.resolution.width;
    this.canvas.style.height = (this.config.output.canvas.resolution.height * this.scaleFactor) + 'px';
    this.canvas.style.width = this.el.offsetWidth + 'px';
    this.draw();
  }

  getTerrainFromArea(area) {
    const configTerrains = this.config.mapTypes[0].terrains;
    const cssHex = intToCssHex(area.color);
    return configTerrains.find(terrain => terrain.color === cssHex);
  }

  setInput(imageData) {
    detectAreas(imageData).then(areas => {
      this.areas = areas.map(area => {
        const terrain = this.getTerrainFromArea(area);
        return {
          priority: terrain.priority,
          data: area.data,
          proc: terrains[terrain.proc]
        };
      }).sort((areaA, areaB) => areaA.priority - areaB.priority);
    }).then(this.draw.bind(this));
  }

  draw() {
    requestAnimationFrame(() => {
      this.ctx.fillStyle = this.config.output.canvas.color;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.areas.forEach(area => area.proc(
        area.data,
        this.config.input.canvas.resolution.width,
        this.config.input.canvas.resolution.height,
        this.canvas.width,
        this.canvas.height,
        this.ctx
      ));
    });
  }
}

export default OutputMap;
