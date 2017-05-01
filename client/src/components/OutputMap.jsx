const React = require('react');
const seedrandom = require('seedrandom');
const {addNoise} = require('../common/imageData');
const terrainClasses = require('../terrains');

class OutputMap extends React.Component {
  constructor(props) {
    super(props);
    this.draw = this.draw.bind(this);
  }

  resizeCanvas() {
    const scaleFactorX = this.el.offsetWidth / this.props.config.output.canvas.resolution.width;
    const scaleFactorY = this.el.offsetHeight / this.props.config.output.canvas.resolution.height;
    this.scaleFactor = scaleFactorX < scaleFactorY ? scaleFactorX : scaleFactorY;
    this.canvas.style.height = (this.props.config.output.canvas.resolution.height * this.scaleFactor) + 'px';
    this.canvas.style.width = (this.props.config.output.canvas.resolution.width * this.scaleFactor) + 'px';
  }

  drawGrid() {
    const gridSpacing = this.canvas.width / 32;
    this.ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    this.ctx.lineWidth = this.canvas.width / 1280;
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
    this.ctx.lineWidth = this.canvas.width / 320;
    this.ctx.strokeRect(borderWidth - 2, borderWidth - 2, this.canvas.width - 2 * borderWidth + 4, this.canvas.height - 2 * borderWidth + 4);
    this.ctx.lineWidth = this.canvas.width / 640;
    this.ctx.strokeRect(borderWidth - 8, borderWidth - 8, this.canvas.width - 2 * borderWidth + 16, this.canvas.height - 2 * borderWidth + 16);
    this.ctx.lineWidth = this.canvas.width / 640;
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = '#e0d088';
    this.ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    this.ctx.lineWidth = this.canvas.width / 1280;
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

  drawWatermark() {
    const watermarkOffset = this.canvas.width / 256;
    const borderWidth = this.canvas.width / 64;
    const watermarkText = 'rpgmaps.herokuapp.com v' + APP_VERSION;
    this.ctx.font = `${borderWidth / 1.5}px sans-serif`;
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.ctx.fillText(watermarkText, borderWidth + watermarkOffset + 1, this.canvas.height - borderWidth - watermarkOffset + 1);
    this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
    this.ctx.fillText(watermarkText, borderWidth + watermarkOffset, this.canvas.height - borderWidth - watermarkOffset);
  }

  applyGlobalLight() {
    this.ctx.save();
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

    this.ctx.restore();
  }

  draw() {
    if (this.drawing) {
      this.pendingDraw = true;
      return;
    }
    this.drawing = true;
    this.ctx.fillStyle = '#c4b191';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const rng = seedrandom('');
    const mapComponents = this.props.mapData.areas.map((area, areaIndex) =>
      new terrainClasses[area.ctor](this.props.mapData, areaIndex, this.ctx, rng));
    new Promise((resolve, reject) => {
      (function next(index) {
        if (mapComponents[index]) mapComponents[index].base().then(() => setTimeout(() => next(index + 1), 0));
        else resolve();
      })(0);
    }).then(() => {
      return new Promise((resolve, reject) => {
        (function next(index) {
          if (mapComponents[index]) mapComponents[index].overlay().then(() => setTimeout(() => next(index + 1), 0));
          else resolve();
        })(0);
      });
    }).then(() => {
      return new Promise((resolve, reject) => requestAnimationFrame(() => {
        this.drawGrid();
        this.drawBorder();
        this.applyGlobalLight();
        this.drawWatermark();
        addNoise(this.ctx, 8);
        resolve();
      }));
    }).then(() => {
      this.drawing = false;
      if (this.pendingDraw) {
        this.pendingDraw = false;
        requestAnimationFrame(this.draw);
      }
    });
  }

  shouldCanvasRedraw() {
    if (!this.props.mapData || this.props.mapData === this.mapData) return false;
    if (!this.mapData || this.props.mapData.areas.length !== this.mapData.areas.length) return true;
    for (let i = 0; i < this.props.mapData.areas.length; i++) {
      if (this.mapData.areas[i].ctor !== this.props.mapData.areas[i].ctor || !this.mapData.areas[i].mask.equals(this.props.mapData.areas[i].mask)) return true;
    }
    return false;
  }

  shouldCanvasResize(elBounds) {
    return !this.elBounds || elBounds.width !== this.elBounds.width || elBounds.height !== this.elBounds.height;
  }

  componentDidUpdate() {
    if (this.shouldCanvasRedraw()) {
      this.mapData = this.props.mapData;
      this.draw();
    }

    const elBounds = this.el.getBoundingClientRect();
    if (this.shouldCanvasResize(elBounds)) {
      this.elBounds = elBounds;
      this.resizeCanvas();
    }
  }

  componentDidMount() {
    this.canvas.width = this.props.config.output.canvas.resolution.width;
    this.canvas.height = this.props.config.output.canvas.resolution.height;
    this.ctx = this.canvas.getContext('2d');
  }

  render() {
    return (
      <div className="output-map" ref={el => this.el = el}>
        <canvas ref={(el) => this.canvas = el} style={{display: this.props.mapData ? 'block' : 'none'}} />
        {!this.props.mapData && this.props.children}
      </div>
    )
  }
}

module.exports = OutputMap;
