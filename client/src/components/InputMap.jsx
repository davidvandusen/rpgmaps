import React, {Component} from 'react';
import {rgbaToCss, cssToRgba} from '../lib/colorCommon';
import {fillImageData} from '../lib/imageDataCommon';
import {pointInCircle} from '../lib/geometryCommon';

export default class InputMap extends Component {
  constructor(props) {
    super(props);
    this.mouse = {
      x: undefined,
      y: undefined,
      buttons: []
    };
    this.brushColor = cssToRgba(this.props.config.terrains[this.props.terrain].color);
    this.addPaintStroke = this.addPaintStroke.bind(this);
    this.draw = this.draw.bind(this);
    this.updateCanvasSize = this.updateCanvasSize.bind(this);
    this.updateMousePosition = this.updateMousePosition.bind(this);
    this.updateMouseButtonsDown = this.updateMouseButtonsDown.bind(this);
    this.updateMouseButtonsUp = this.updateMouseButtonsUp.bind(this);
  }

  componentDidUpdate() {
    this.brushColor = cssToRgba(this.props.config.terrains[this.props.terrain].color);
    this.draw();
  }

  drawBrush() {
    if (this.mouse.x === undefined || this.mouse.y === undefined) return;
    this.ctx.beginPath();
    this.ctx.arc(this.mouse.x + 0.5, this.mouse.y + 0.5, this.props.brushSize / 2, 0, Math.PI * 2, true);
    this.ctx.strokeStyle = 'rgba(255,255,255,1)';
    this.ctx.stroke();
    this.ctx.fillStyle = rgbaToCss(...this.brushColor.slice(0, 3), 127);
    this.ctx.fill();
  }

  draw() {
    requestAnimationFrame(() => {
      this.ctx.putImageData(this.paintLayer, 0, 0);
      if (this.mouse.x >= 0 && this.mouse.x < this.canvas.width && this.mouse.y >= 0 && this.mouse.y < this.canvas.height) {
        this.drawBrush();
      }
    });
  }

  updateCanvasSize() {
    const scaleFactorX = this.el.offsetWidth / this.props.config.input.canvas.resolution.width;
    const scaleFactorY = this.el.offsetHeight / this.props.config.input.canvas.resolution.height;
    this.scaleFactor = scaleFactorX < scaleFactorY ? scaleFactorX : scaleFactorY;
    this.canvas.style.height = (this.props.config.input.canvas.resolution.height * this.scaleFactor) + 'px';
    this.canvas.style.width = (this.props.config.input.canvas.resolution.width * this.scaleFactor) + 'px';
  }

  updateMousePosition(event) {
    const position = this.canvas.getBoundingClientRect();
    this.mouse.x = Math.round((event.clientX - position.left) / this.scaleFactor);
    this.mouse.y = Math.round((event.clientY - position.top) / this.scaleFactor);
  }

  updateMouseButtonsDown(event) {
    if (event.button === 0) this.mouse.buttons[0] = true;
  }

  updateMouseButtonsUp(event) {
    if (event.button === 0) this.mouse.buttons[0] = false;
  }

  addPaintStroke() {
    if (this.mouse.buttons[0]) {
      const data = this.paintLayer.data;
      for (let index = 0; index < data.length; index += 4) {
        const n = Math.floor(index / 4);
        const x = n % this.paintLayer.width;
        const y = Math.floor(n / this.paintLayer.width);
        if (pointInCircle(x, y, this.mouse.x, this.mouse.y, this.props.brushSize / 2)) {
          data[index] = this.brushColor[0];
          data[index + 1] = this.brushColor[1];
          data[index + 2] = this.brushColor[2];
          data[index + 3] = this.brushColor[3];
        }
      }
    }
  }

  reset() {
    fillImageData(this.paintLayer, ...cssToRgba(this.props.config.terrains[0].color));
  }

  componentDidMount() {
    this.canvas.width = this.props.config.input.canvas.resolution.width;
    this.canvas.height = this.props.config.input.canvas.resolution.height;
    this.ctx = this.canvas.getContext('2d');
    this.paintLayer = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    this.reset();
    this.props.setImageData(this.paintLayer);
    this.updateCanvasSize();
    window.addEventListener('resize', this.updateCanvasSize);
    document.addEventListener('mousemove', this.updateMousePosition, true);
    document.addEventListener('mousedown', this.updateMouseButtonsDown, true);
    document.addEventListener('mouseup', this.updateMouseButtonsUp, true);
    this.canvas.addEventListener('mousedown', this.addPaintStroke);
    this.canvas.addEventListener('mousemove', this.addPaintStroke);
    this.canvas.addEventListener('mousedown', this.draw);
    document.addEventListener('mousemove', this.draw);
    document.addEventListener('mouseup', this.props.updateImageData);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateCanvasSize);
    document.removeEventListener('mousemove', this.updateMousePosition, true);
    document.removeEventListener('mousedown', this.updateMouseButtonsDown, true);
    document.removeEventListener('mouseup', this.updateMouseButtonsUp, true);
    this.canvas.removeEventListener('mousedown', this.addPaintStroke);
    this.canvas.removeEventListener('mousemove', this.addPaintStroke);
    this.canvas.removeEventListener('mousedown', this.draw);
    document.removeEventListener('mousemove', this.draw);
    document.removeEventListener('mouseup', this.props.updateImageData);
  }

  render() {
    return (
      <div className="input-map" ref={el => this.el = el}>
        <canvas ref={canvas => this.canvas = canvas} />
      </div>
    )
  }
}
