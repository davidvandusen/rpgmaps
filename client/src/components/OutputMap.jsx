const React = require('react');
const seedrandom = require('seedrandom');
const {addNoise} = require('../common/imageData');
const terrainClasses = require('../terrains');

class OutputMap extends React.Component {
  constructor(props) {
    super(props);
    this.initialRender = true;
    this.draw = this.draw.bind(this);
  }

  resizeCanvas() {
    const scaleFactorX = this.el.offsetWidth / this.props.config.output.canvas.resolution.width;
    const scaleFactorY = this.el.offsetHeight / this.props.config.output.canvas.resolution.height;
    this.scaleFactor = scaleFactorX < scaleFactorY ? scaleFactorX : scaleFactorY;
    this.canvas.style.height = (this.props.config.output.canvas.resolution.height * this.scaleFactor) + 'px';
    this.canvas.style.width = (this.props.config.output.canvas.resolution.width * this.scaleFactor) + 'px';
  }

  setGridStyle() {
    this.ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    this.ctx.lineWidth = this.canvas.width / 1280;
    this.ctx.lineJoin = 'miter';
    this.ctx.lineCap = 'butt';
    this.ctx.setLineDash([]);
  }

  drawSquareGrid() {
    const gridSpacing = this.canvas.width / 40;
    this.ctx.beginPath();
    for (let i = gridSpacing; i < this.canvas.width; i += gridSpacing) {
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvas.height);
    }
    for (let i = gridSpacing; i < this.canvas.height; i += gridSpacing) {
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.canvas.width, i);
    }
    this.setGridStyle();
    this.ctx.stroke();
  }

  drawFlatHexGrid() {
    const gridSpacing = this.canvas.width / 32;
    let offset = false;
    this.ctx.beginPath();
    const height = gridSpacing * Math.sqrt(3) * 0.5;
    for (let y = 0; y < this.canvas.height; y += height * 0.5) {
      for (let x = gridSpacing * (offset ? 0.25 : 1); x < this.canvas.width; x += gridSpacing * 1.5) {
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + gridSpacing * 0.5, y);
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x - gridSpacing * 0.25, y + height * 0.5);
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x - gridSpacing * 0.25, y - height * 0.5);
      }
      offset = !offset;
    }
    this.setGridStyle();
    this.ctx.stroke();
  }

  drawPointyHexGrid() {
    const gridSpacing = this.canvas.width / 32;
    let offset = false;
    this.ctx.beginPath();
    const width = gridSpacing * Math.sqrt(3) * 0.5;
    for (let y = 0; y < this.canvas.height; y += gridSpacing * 0.75) {
      for (let x = width * (offset ? 0.5 : 0); x < this.canvas.width; x += width) {
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, y + gridSpacing * 0.5);
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width * 0.5, y - gridSpacing * 0.25);
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x - width * 0.5, y - gridSpacing * 0.25);
      }
      offset = !offset;
    }
    this.setGridStyle();
    this.ctx.stroke();
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
    const offset = this.canvas.width / 128;
    const borderWidth = this.canvas.width / 64;
    const watermarkText = 'rpgmaps.herokuapp.com v' + APP_VERSION;
    this.ctx.font = `${borderWidth * 0.7}px sans-serif`;
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.ctx.fillText(watermarkText, borderWidth + offset + 1, this.canvas.height - borderWidth - offset + 1);
    this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
    this.ctx.fillText(watermarkText, borderWidth + offset, this.canvas.height - borderWidth - offset);
  }

  drawScaleText() {
    const offset = this.canvas.width / 128;
    const borderWidth = this.canvas.width / 64;
    const watermarkHeight = offset * 2.2;
    const scaleText = '1 square = 5 feet';
    this.ctx.font = `${borderWidth}px serif`;
    this.ctx.fillStyle = 'rgb(255,255,255)';
    this.ctx.fillText(scaleText, borderWidth + offset, this.canvas.height - borderWidth - offset - watermarkHeight);
  }

  drawCompassRose() {
    const offset = this.canvas.width / 128;
    const unit = this.canvas.width / 256;
    const borderWidth = this.canvas.width / 64;
    const textSectionHeight = offset * 10;
    this.ctx.translate(borderWidth + unit * 12, this.canvas.height - borderWidth - textSectionHeight);
    this.ctx.rotate(0);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, unit * -10);
    this.ctx.lineTo(unit * 2, unit * -4);
    this.ctx.lineTo(unit * 0.5, unit * -4);
    this.ctx.lineTo(unit * 0.5, 0);
    this.ctx.closePath();
    this.ctx.fillStyle = 'rgb(255,255,255)';
    this.ctx.fill();
    this.ctx.font = `${borderWidth * 1.7}px serif`;
    this.ctx.fillText('N', -offset, borderWidth * 1.7);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
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

  draw(redraw) {
    if (this.drawing) {
      this.pendingDraw = true;
      return;
    }
    this.pendingDraw = false;
    this.drawing = true;
    if (redraw || this.initialRender) {
      this.initialRender = false;
      this.ctx.fillStyle = '#c4b191';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    const rng = seedrandom('');
    const mapComponents = this.props.mapData.areas.map((area, areaIndex) =>
      new terrainClasses[area.ctor](this.props.mapData, areaIndex, this.ctx, rng));
    new Promise((resolve, reject) => {
      (function next(index) {
        if (this.pendingDraw) return reject('abort');
        if (mapComponents[index]) mapComponents[index].base().then(() => setTimeout(next.bind(this, index + 1), 0));
        else resolve();
      }).call(this, 0);
    }).then(() => {
      return new Promise((resolve, reject) => {
        (function next(index) {
          if (this.pendingDraw) return reject('abort');
          if (mapComponents[index]) mapComponents[index].overlay().then(() => setTimeout(next.bind(this, index + 1), 0));
          else resolve();
        }).call(this, 0);
      });
    }).then(() => {
      return new Promise((resolve, reject) => setTimeout(() => {
        if (this.props.grid === 'square') {
          this.drawSquareGrid();
        }
        if (this.props.grid === 'flat-hex') {
          this.drawFlatHexGrid();
        }
        if (this.props.grid === 'pointy-hex') {
          this.drawPointyHexGrid();
        }
        this.drawBorder();
        this.applyGlobalLight();
        this.drawWatermark();
        if (this.props.showScale) {
          this.drawScaleText();
        }
        this.drawCompassRose();
        addNoise(this.ctx, 8);
        resolve();
      }, 0));
    }).then(() => {
      this.drawing = false;
      if (this.pendingDraw) setTimeout(this.draw, 0);
    }).catch(err => {
      this.drawing = false;
      if (err === 'abort') setTimeout(this.draw, 0);
    });
  }

  shouldCanvasRedraw() {
    if (!this.props.mapData) return false;
    if (this.props.grid !== this.grid) return true;
    if (this.props.mapData === this.mapData) return false;
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
      this.grid = this.props.grid;
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
