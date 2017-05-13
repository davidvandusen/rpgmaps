const React = require('react');
const {connect} = require('react-redux');

class InputImage extends React.Component {
  getContext() {
    return this.canvas.getContext('2d');
  }

  getImageContext() {
    return this.imageCanvas.getContext('2d');
  }

  draw() {
    const ctx = this.getContext();
    ctx.save();

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.translate(this.props.surface.x, this.props.surface.y);
    ctx.scale(this.props.surface.scale, this.props.surface.scale);

    ctx.beginPath();
    ctx.rect(0, 0, this.props.surface.width, this.props.surface.height);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1 / this.props.surface.scale;
    ctx.stroke();

    if (this.props.inputImageData) {
      const imageCtx = this.getImageContext();
      imageCtx.save();
      imageCtx.clearRect(0, 0, imageCtx.canvas.width, imageCtx.canvas.height);
      imageCtx.putImageData(this.props.inputImageData, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.imageCanvas, 0, 0);
      imageCtx.restore();
    }

    ctx.restore();
  }

  componentDidMount() {
    this.imageCanvas = document.createElement('canvas');
    this.imageCanvas.width = this.props.surface.width;
    this.imageCanvas.height = this.props.surface.height;
    this.draw();
  }

  componentDidUpdate() {
    this.imageCanvas.width = this.props.surface.width;
    this.imageCanvas.height = this.props.surface.height;
    this.draw();
  }

  render() {
    const canvasStyle = {
      width: this.props.width + 'px',
      height: this.props.height + 'px'
    };
    return (
      <canvas
        ref={el => this.canvas = el}
        className="input-image"
        width={this.props.width}
        height={this.props.height}
        style={canvasStyle}/>
    );
  }
}

const mapStateToProps = state => ({
  inputImageData: state.inputImageData,
  surface: state.surface,
  width: state.width,
  height: state.height
});

module.exports = connect(mapStateToProps)(InputImage);
