class InputMap {

  static coordsFromDataPoint(i, w, bytes = 4) {
    const n = Math.floor(i / bytes);
    return [n % w, Math.floor(n / w)];
  }

  static pointInCircle(x, y, cx, cy, r) {
    return Math.sqrt(Math.pow(Math.abs(x - cx), 2) + Math.pow(Math.abs(y - cy), 2)) <= r;
  }

  static fillImageData(imageData, color) {
    for (let i = 0; i < imageData.length; i += 4) {
      imageData[i] = color[0];
      imageData[i + 1] = color[1];
      imageData[i + 2] = color[2];
      imageData[i + 3] = color[3] || 0xff;
    }
  }

  constructor(config) {
    this.config = config;
    this.canvas = document.createElement('canvas');
    this.canvas.style.cursor = 'crosshair';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;
    this.canvas.width = this.config.canvas.resolution.width;
    this.canvas.height = this.config.canvas.resolution.height;
    this.canvas.style.imageRendering = 'pixelated';
    this.updateCanvasSize();
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.mouse = {x: this.canvas.width / 2, y: this.canvas.height / 2, buttons: [false, false, false]};
    this.brush = {size: this.config.brush.size.default, color: [0, 0, 0]};
    this.paintLayer = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    this.colors = [
      [0x4b, 0x83, 0x94],
      [0xec, 0xdd, 0xaf],
      [0xd3, 0xe5, 0xb5],
      [0xdd, 0xd8, 0xba],
      [0xe4, 0xe4, 0xe4],
      [0xb2, 0xc6, 0xb7],
      [0x5c, 0x94, 0x75],
      [0x79, 0x74, 0x70]
    ];
    this.currentColor = 1;
    this.brush.color = this.colors[this.currentColor];
    InputMap.fillImageData(this.paintLayer.data, this.colors[0]);
    this.update(true);
    window.addEventListener('resize', this.updateCanvasSize.bind(this));
    document.addEventListener('keypress', this.cycleColors.bind(this));
    document.addEventListener('keypress', this.updateBrushSize.bind(this));
    document.addEventListener('mousemove', this.updateMousePosition.bind(this));
    document.addEventListener('mousedown', this.updateMouseButtonsDown.bind(this));
    document.addEventListener('mouseup', this.updateMouseButtonsUp.bind(this));
    document.addEventListener('mousemove', this.addPaintStroke.bind(this));
    document.addEventListener('mousedown', this.addPaintStroke.bind(this));
    document.addEventListener('mouseup', this.update.bind(this, true));
  }

  updateCanvasSize() {
    this.aspectRatio = this.config.canvas.resolution.height / this.config.canvas.resolution.width;
    this.windowAspectRatio = window.innerHeight / window.innerWidth;
    if (this.windowAspectRatio < this.aspectRatio) {
      this.scaleFactor = window.innerHeight / this.config.canvas.resolution.height;
      this.canvas.style.height = window.innerHeight + 'px';
      this.canvas.style.width = (this.config.canvas.resolution.width * this.scaleFactor) + 'px';
    } else {
      this.scaleFactor = window.innerWidth / this.config.canvas.resolution.width;
      this.canvas.style.height = (this.config.canvas.resolution.height * this.scaleFactor) + 'px';
      this.canvas.style.width = window.innerWidth + 'px';
    }
    this.update();
  }

  updateMousePosition(event) {
    this.mouse.x = event.clientX / this.scaleFactor;
    this.mouse.y = event.clientY / this.scaleFactor;
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
    if (event.key === '[') this.brush.size = Math.max(this.brush.size - 1, this.config.brush.size.min);
    if (event.key === ']') this.brush.size = Math.min(this.brush.size + 1, this.config.brush.size.max);
    this.update();
  }

  addPaintStroke() {
    if (this.mouse.buttons[0]) {
      const data = this.paintLayer.data;
      for (let i = 0; i < data.length; i += 4) {
        const [x, y] = InputMap.coordsFromDataPoint(i, this.paintLayer.width);
        if (InputMap.pointInCircle(x, y, this.mouse.x, this.mouse.y, this.brush.size)) {
          data[i] = this.brush.color[0];
          data[i + 1] = this.brush.color[1];
          data[i + 2] = this.brush.color[2];
          data[i + 3] = 0xff;
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

  update(publish = false) {
    if (publish && typeof this.onUpdate === 'function') {
      this.onUpdate.call(null, this.paintLayer.data);
    }
    this.draw();
  }

  draw() {
    if (this._pendingAnimationFrameId) return;
    this._pendingAnimationFrameId = requestAnimationFrame(() => {
      this._pendingAnimationFrameId = undefined;
      this.ctx.putImageData(this.paintLayer, 0, 0);
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, this.brush.size + 0.5, 0, Math.PI * 2, true);
      this.ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, this.brush.size, 0, Math.PI * 2, true);
      this.ctx.fillStyle = `rgba(${this.brush.color[0]},${this.brush.color[1]},${this.brush.color[2]},${this.mouse.buttons[0] ? 1 : 0.25})`;
      this.ctx.fill();
      this.ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      this.ctx.stroke();
    });
  }
}

export default InputMap;
