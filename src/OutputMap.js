import {detectAreas} from './imageDataCommon';
import {intToCssHex} from './colorCommon';

class OutputMap {
  constructor(el, config, inputMap) {
    this.el = el;
    this.config = config;
    this.inputMap = inputMap;
    const originalOnInit = this.inputMap.onInit;
    this.inputMap.onInit = () => {
      if (typeof originalOnInit === 'function') originalOnInit();
      this.init();
    };
    const originalOnUpdate = this.inputMap.onUpdate;
    this.inputMap.onUpdate = (imageData) => {
      if (typeof originalOnUpdate === 'function') originalOnUpdate();
      detectAreas(imageData)
        .then(areas => {
          areas.forEach(area => area.color = intToCssHex(area.color));
          return areas;
        });
    };
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.config.output.canvas.resolution.width;
    this.canvas.height = this.config.output.canvas.resolution.height;
    this.ctx = this.canvas.getContext('2d');
  }

  init() {
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

  draw() {
    if (this._pendingAnimationFrameId) return;
    this._pendingAnimationFrameId = requestAnimationFrame(() => {
      this._pendingAnimationFrameId = undefined;
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    });
  }

}

export default OutputMap;
