import React, {Component} from 'react';
import seedrandom from 'seedrandom';
import {addNoise} from '../lib/imageDataCommon';
import * as terrainClasses from '../terrains';

export default class OutputMap extends Component {
  constructor(props) {
    super(props);
    this.draw = this.draw.bind(this);
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
        const mapComponents = this.props.areas.map(area => new terrainClasses[area.ctor](area.mask, this.ctx, rng));
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

  shouldCanvasRedraw() {
    if (this.areas === this.props.areas) {
      // areas are same object
      return false;
    }
    if (!this.props.areas || !this.props.areas.length) {
      // no areas
      return false;
    }
    if (!this.areas || this.areas.length !== this.props.areas.length) {
      // new areas diff from old areas
      return true;
    }
    for (let i = 0; i < this.props.areas.length; i++) {
      if (this.areas[i].ctor !== this.props.areas[i].ctor || !this.areas[i].mask.equals(this.props.areas[i].mask)) {
        // found a non-matching area
        return true;
      }
    }
    // areas are identical
    return false;
  }

  componentDidUpdate() {
    if (this.shouldCanvasRedraw()) this.draw();
    this.areas = this.props.areas;
  }

  componentDidMount() {
    this.canvas.width = this.props.config.output.canvas.resolution.width;
    this.canvas.height = this.props.config.output.canvas.resolution.height;
    this.ctx = this.canvas.getContext('2d');
  }

  render() {
    return (
      <div className="output-map" ref={el => this.el = el}>
        <canvas ref={(el) => this.canvas = el} style={{display: this.props.areas ? 'block' : 'none'}} />
        {!this.props.areas && this.props.children}
      </div>
    )
  }
}
