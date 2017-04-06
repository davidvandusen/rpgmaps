import {fillImageData} from './common/imageDataCommon';
import {pointInCircle} from './common/geometryCommon';
import {rgbaToCss, cssToRgba} from './common/colorCommon';

export default class InputMap {
  constructor(el, config) {
    this.el = el;
    this.config = config;
    this.canvas = document.createElement('canvas');
    this.canvas.style.cursor = 'none';
    this.canvas.width = this.config.input.canvas.resolution.width;
    this.canvas.height = this.config.input.canvas.resolution.height;
    this.canvas.style.imageRendering = 'pixelated';
    this.ctx = this.canvas.getContext('2d');
    this.mouse = {x: this.canvas.width / 2, y: this.canvas.height / 2, buttons: [false, false, false]};
    this.brush = {size: this.config.input.brush.size.default, color: [0, 0, 0, 0]};
    this.paintLayer = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    this.colors = this.config.mapTypes[0].terrains.map(terrain => cssToRgba(terrain.color));
    this.currentColor = 1;
    this.brush.color = this.colors[this.currentColor];
  }

  init() {
    this.updateCanvasSize();
    fillImageData(this.paintLayer, ...this.colors[0]);
    this.update(true);
    this.el.appendChild(this.canvas);
    window.addEventListener('resize', this.updateCanvasSize.bind(this));
    document.addEventListener('keypress', this.cycleColors.bind(this));
    document.addEventListener('keypress', this.updateBrushSize.bind(this));
    document.addEventListener('mousedown', this.updateMousePosition.bind(this));
    document.addEventListener('mouseup', this.updateMousePosition.bind(this));
    document.addEventListener('mousedown', this.updateMouseButtonsDown.bind(this));
    document.addEventListener('mouseup', this.updateMouseButtonsUp.bind(this));
    document.addEventListener('mousedown', this.addPaintStroke.bind(this));
    document.addEventListener('mouseup', this.update.bind(this, true));
    document.addEventListener('mousemove', this.updateMousePosition.bind(this));
    document.addEventListener('mousemove', this.addPaintStroke.bind(this));
    if (typeof this.onInit === 'function') this.onInit.call(null);
  }

  updateCanvasSize() {
    const scaleFactorX = this.el.offsetWidth / this.config.input.canvas.resolution.width;
    const scaleFactorY = this.el.offsetHeight / this.config.input.canvas.resolution.height;
    this.scaleFactor = scaleFactorX < scaleFactorY ? scaleFactorX : scaleFactorY;
    this.canvas.style.height = (this.config.input.canvas.resolution.height * this.scaleFactor) + 'px';
    this.canvas.style.width = (this.config.input.canvas.resolution.width * this.scaleFactor) + 'px';
    this.update();
  }

  updateMousePosition(event) {
    const position = this.canvas.getBoundingClientRect();
    this.mouse.x = Math.round((event.clientX - position.left) / this.scaleFactor);
    this.mouse.y = Math.round((event.clientY - position.top) / this.scaleFactor);
    this.update();
  }

  updateMouseButtonsDown(event) {
    if (event.button === 0) this.mouse.buttons[0] = true;
    this.update();
  }

  updateMouseButtonsUp(event) {
    if (event.button === 0) this.mouse.buttons[0] = false;
    this.update();
  }

  updateBrushSize(event) {
    if (event.key === '[') this.brush.size = Math.max(this.brush.size - 1, this.config.input.brush.size.min);
    if (event.key === ']') this.brush.size = Math.min(this.brush.size + 1, this.config.input.brush.size.max);
    this.update();
  }

  addPaintStroke() {
    if (this.mouse.buttons[0]) {
      const data = this.paintLayer.data;
      for (let index = 0; index < data.length; index += 4) {
        const n = Math.floor(index / 4);
        const x = n % this.paintLayer.width;
        const y = Math.floor(n / this.paintLayer.width);
        if (pointInCircle(x, y, this.mouse.x, this.mouse.y, this.brush.size / 2)) {
          data[index] = this.brush.color[0];
          data[index + 1] = this.brush.color[1];
          data[index + 2] = this.brush.color[2];
          data[index + 3] = 0xff;
        }
      }
      this.update();
    }
  }

  cycleColors(event) {
    if (event.key === '.') {
      this.currentColor = (this.currentColor + 1) % this.colors.length;
      this.brush.color = this.colors[this.currentColor];
      this.update();
    }
  }

  update(publish) {
    if (publish && typeof this.onUpdate === 'function') {
      this.onUpdate.call(null, this.paintLayer);
    }
    this.draw();
  }

  draw() {
    if (this._pendingAnimationFrameId) return;
    this._pendingAnimationFrameId = requestAnimationFrame(() => {
      this._pendingAnimationFrameId = undefined;
      this.ctx.putImageData(this.paintLayer, 0, 0);
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x + 0.5, this.mouse.y + 0.5, this.brush.size / 2, 0, Math.PI * 2, true);
      this.ctx.strokeStyle = 'rgba(255,255,255,1)';
      this.ctx.stroke();
      this.ctx.fillStyle = rgbaToCss(...this.brush.color.slice(0, 3), this.mouse.buttons[0] ? 255 : 127);
      this.ctx.fill();
    });
  }
}
