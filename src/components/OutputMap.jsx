import React, {Component} from 'react';
import seedrandom from 'seedrandom';
import {detectAreas, addNoise, areSamePixels} from '../lib/imageDataCommon';
import {intToCssHex} from '../lib/colorCommon';
import * as terrainClasses from '../terrains';

export default class OutputMap extends Component {
  constructor(props) {
    super(props);
    this.draw = this.draw.bind(this);
    this.processImageData = this.processImageData.bind(this);
    this.updateCanvasSize = this.updateCanvasSize.bind(this);
  }

  drawGrid() {
    const gridSpacing = this.canvas.width / 32;
    this.ctx.strokeStyle = 'rgba(0,0,0,0.125)';
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

    this.ctx.shadowBlur = borderWidth * 4;
    this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
    this.ctx.fillStyle = '#cab9a3';
    this.ctx.fillRect(borderWidth, 0, this.canvas.width - 2 * borderWidth, borderWidth);
    this.ctx.fillRect(0, borderWidth, borderWidth, this.canvas.height - 2 * borderWidth);
    this.ctx.fillRect(borderWidth, this.canvas.height - borderWidth, this.canvas.width - 2 * borderWidth, borderWidth);
    this.ctx.fillRect(this.canvas.width - borderWidth, borderWidth, borderWidth, this.canvas.height - 2 * borderWidth);
    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = 'rgba(0,0,0,0)';

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

  applyGlobalLight() {
    let gradient;

    gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, Math.sqrt(Math.pow(this.canvas.width, 2) + Math.pow(this.canvas.height, 2)));
    gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    this.ctx.globalCompositeOperation = 'overlay';
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, Math.sqrt(Math.pow(this.canvas.width, 2) + Math.pow(this.canvas.height, 2)));
    gradient.addColorStop(0, 'rgba(255,255,255,0.125)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    this.ctx.globalCompositeOperation = 'overlay';
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.globalCompositeOperation = 'source-over';
  }

  draw() {
    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        this.ctx.fillStyle = 'rgb(127,127,127)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const rng = seedrandom('');
        const mapComponents = this.areas.map(area => new area.class(area.mask, this.ctx, rng));
        mapComponents.forEach(component => component.base());
        mapComponents.forEach(component => component.overlay());
        this.drawGrid();
        this.drawBorder();
        this.applyGlobalLight();
        addNoise(this.ctx, 8);
        resolve();
      });
    });
  }

  getTerrainFromArea(area) {
    const cssHex = intToCssHex(area.color);
    return this.props.config.terrains.find(terrain => terrain.color === cssHex);
  }

  updateAreas() {
    return detectAreas(this.props.imageData).then(areas => {
      return this.areas = areas.map(area => {
        const terrain = this.getTerrainFromArea(area);
        return {
          layer: terrain.layer,
          mask: area.mask,
          class: terrainClasses[terrain.className]
        };
      }).sort((areaA, areaB) => areaA.layer - areaB.layer);
    });
  }

  processImageData() {
    if (this.props.status !== 'ready') {
      this.hasUnprocessedImageData = true;
      return;
    }
    this.props.setStatus('processing');
    this.updateAreas()
      .then(this.draw)
      .then(() => {
        this.props.setStatus('ready');
        if (this.hasUnprocessedImageData) {
          this.hasUnprocessedImageData = false;
          setTimeout(this.processImageData, 0);
        }
      });
  }

  componentDidUpdate() {
    if (this.props.imageData && !this.pixels || !areSamePixels(this.pixels, this.props.imageData.data)) {
      this.pixels = this.props.imageData.data.slice(0);
      this.processImageData();
    }
  }

  updateCanvasSize() {
    const scaleFactorX = this.el.offsetWidth / this.props.config.input.canvas.resolution.width;
    const scaleFactorY = this.el.offsetHeight / this.props.config.input.canvas.resolution.height;
    this.scaleFactor = scaleFactorX < scaleFactorY ? scaleFactorX : scaleFactorY;
    this.canvas.style.height = (this.props.config.input.canvas.resolution.height * this.scaleFactor) + 'px';
    this.canvas.style.width = (this.props.config.input.canvas.resolution.width * this.scaleFactor) + 'px';
  }

  componentDidMount() {
    this.canvas.width = this.props.config.output.canvas.resolution.width;
    this.canvas.height = this.props.config.output.canvas.resolution.height;
    this.ctx = this.canvas.getContext('2d');
    this.updateCanvasSize();
    this.props.setStatus('ready');
    window.addEventListener('resize', this.updateCanvasSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateCanvasSize);
  }

  render() {
    return (
      <div className="output-map" ref={el => this.el = el}>
        <canvas ref={(el) => this.canvas = el} />
      </div>
    )
  }
}
