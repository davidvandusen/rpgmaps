const React = require('react');
const {connect} = require('react-redux');
const seedrandom = require('seedrandom');
const terrainClasses = require('../terrains');
const {addNoise} = require('../common/imageData');

class OutputImage extends React.Component {
  getContext() {
    return this.canvas.getContext('2d');
  }

  getImageContext() {
    return this.imageCanvas.getContext('2d');
  }

  draw() {
    if (this.image) {
      const ctx = this.getContext();
      ctx.save();
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.translate(this.props.surface.x, this.props.surface.y);
      ctx.scale(this.props.surface.scale / this.props.outputQuality, this.props.surface.scale / this.props.outputQuality);
      const imageCtx = this.getImageContext();
      imageCtx.save();
      imageCtx.clearRect(0, 0, imageCtx.canvas.width, imageCtx.canvas.height);
      imageCtx.putImageData(this.image, 0, 0);
      ctx.drawImage(this.imageCanvas, 0, 0);
      imageCtx.restore();
      ctx.restore();
    }
  }

  applyGlobalLight(ctx) {
    let gradient;

    gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.sqrt(Math.pow(ctx.canvas.width, 2) + Math.pow(ctx.canvas.height, 2)));
    gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.sqrt(Math.pow(ctx.canvas.width, 2) + Math.pow(ctx.canvas.height, 2)));
    gradient.addColorStop(0, 'rgba(255,255,255,0.125)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.restore();
  }

  renderImageLayer(mapComponents, layer) {
    return new Promise((resolve, reject) => {
      function next(index) {
        const mapComponent = mapComponents[index];
        if (mapComponent) mapComponent[layer]().then(() => setTimeout(() => next(index + 1), 0));
        else resolve();
      }

      next(0);
    });
  }

  updateImage() {
    const canvas = document.createElement('canvas');
    canvas.width = this.props.surface.width * this.props.outputQuality;
    canvas.height = this.props.surface.height * this.props.outputQuality;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#c4b191';
    ctx.fill();
    const rng = seedrandom(this.props.randomnessSeed);
    const mapComponents = this.props.mapData.areas.map((area, areaIndex) => new terrainClasses[area.ctor](this.props.mapData, areaIndex, ctx, rng));
    this.renderImageLayer(mapComponents, 'base').then(() => {
      return this.renderImageLayer(mapComponents, 'overlay');
    }).then(() => {
      this.applyGlobalLight(ctx);
      this.image = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      addNoise(this.image, 8);
      this.draw();
    });
  }

  shouldImageUpdate(mapData, newMapData) {
    if (!newMapData) return false;
    if (newMapData === mapData) return false;
    if (!mapData) return true;
    if (newMapData.areas.length !== newMapData.areas.length) return true;
    for (let i = 0; i < newMapData.areas.length; i++) {
      if (mapData.areas[i].ctor !== newMapData.areas[i].ctor) return true;
      if (!mapData.areas[i].mask.equals(newMapData.areas[i].mask)) return true;
    }
    return false;
  }

  onUpdate() {
    this.imageCanvas.width = this.props.surface.width * this.props.outputQuality;
    this.imageCanvas.height = this.props.surface.height * this.props.outputQuality;
    this.draw();
    if (this.shouldImageUpdate(this._mapData, this.props.mapData)) {
      this._mapData = this.props.mapData;
      this.updateImage();
    }
  }

  componentDidMount() {
    this.imageCanvas = document.createElement('canvas');
    this.onUpdate();
  }

  componentDidUpdate() {
    this.onUpdate();
  }

  render() {
    const canvasStyle = {
      width: this.props.width + 'px',
      height: this.props.height + 'px'
    };
    return (
      <canvas
        ref={el => this.canvas = el}
        className="output-image"
        width={this.props.width}
        height={this.props.height}
        style={canvasStyle} />
    );
  }
}

const mapStateToProps = state => ({
  randomnessSeed: state.randomnessSeed,
  outputQuality: state.outputQuality,
  mapData: state.mapData,
  surface: state.surface,
  width: state.width,
  height: state.height
});

module.exports = connect(mapStateToProps)(OutputImage);
