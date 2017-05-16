const React = require('react');
const {connect} = require('react-redux');
const seedrandom = require('seedrandom');
const terrainClasses = require('../terrains');

class OutputImage extends React.Component {
  getContext() {
    return this.canvas.getContext('2d');
  }

  getImageContext() {
    return this.imageCanvas.getContext('2d');
  }

  draw() {
    if (this.imageCanvasData) {
      const ctx = this.getContext();
      ctx.save();
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.translate(this.props.surface.x, this.props.surface.y);
      ctx.scale(this.props.surface.scale / this.props.outputQuality, this.props.surface.scale / this.props.outputQuality);
      const imageCtx = this.getImageContext();
      imageCtx.save();
      imageCtx.clearRect(0, 0, imageCtx.canvas.width, imageCtx.canvas.height);
      imageCtx.putImageData(this.imageCanvasData, 0, 0);
      ctx.drawImage(this.imageCanvas, 0, 0);
      imageCtx.restore();
      ctx.restore();
    }
  }

  update() {
    if (this.updating) {
      this.pendingUpdate = true;
      return;
    }
    this.updating = true;
    this.pendingUpdate = false;
    const ctx = this.getImageContext();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#c4b191';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const rng = seedrandom('');
    const mapComponents = this.props.mapData.areas.map((area, areaIndex) => {
      return new terrainClasses[area.ctor](this.props.mapData, areaIndex, ctx, rng);
    });
    new Promise((resolve, reject) => {
      return (function next(index) {
        if (this.pendingUpdate) reject('abort');
        if (mapComponents[index]) {
          mapComponents[index].base().then(() => {
            return setTimeout(next.bind(this, index + 1), 0);
          });
        } else {
          resolve(mapComponents);
        }
      }).call(this, 0);
    }).then(mapComponents => {
      return new Promise((resolve, reject) => {
        return (function next(index) {
          if (this.pendingUpdate) reject('abort');
          if (mapComponents[index]) {
            mapComponents[index].overlay().then(() => {
              return setTimeout(next.bind(this, index + 1), 0);
            });
          } else {
            resolve();
          }
        }).call(this, 0);
      });
    }).then(() => {
      this.updating = false;
      this.imageCanvasData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.draw();
    }).catch(err => {
      this.updating = false;
      if (err === 'abort') {
        this.update();
      }
    });
  }

  shouldCanvasUpdate() {
    if (!this.props.mapData) return false;
    if (this.props.mapData === this.mapData) return false;
    if (!this.mapData || this.props.mapData.areas.length !== this.mapData.areas.length) return true;
    for (let i = 0; i < this.props.mapData.areas.length; i++) {
      if (this.mapData.areas[i].ctor !== this.props.mapData.areas[i].ctor || !this.mapData.areas[i].mask.equals(this.props.mapData.areas[i].mask)) return true;
    }
    return false;
  }

  componentDidMount() {
    this.imageCanvas = document.createElement('canvas');
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    this.imageCanvas.width = this.props.surface.width * this.props.outputQuality;
    this.imageCanvas.height = this.props.surface.height * this.props.outputQuality;
    if (this.shouldCanvasUpdate()) {
      this.mapData = this.props.mapData;
      this.update();
    } else {
      this.draw();
    }
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
  outputQuality: state.outputQuality,
  mapData: state.mapData,
  surface: state.surface,
  width: state.width,
  height: state.height
});

module.exports = connect(mapStateToProps)(OutputImage);
