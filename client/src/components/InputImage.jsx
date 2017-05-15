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
    if (this.props.inputImageData) {
      const ctx = this.getContext();
      ctx.save();
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.translate(this.props.surface.x, this.props.surface.y);
      ctx.scale(this.props.surface.scale, this.props.surface.scale);
      const imageCtx = this.getImageContext();
      imageCtx.save();
      imageCtx.clearRect(0, 0, imageCtx.canvas.width, imageCtx.canvas.height);
      imageCtx.putImageData(this.props.inputImageData, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.imageCanvas, 0, 0);
      imageCtx.restore();
      ctx.restore();
    }
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
      height: this.props.height + 'px',
      opacity: this.props.inputImageOpacity
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
  inputImageOpacity: state.inputImageOpacity,
  inputImageData: state.inputImageData,
  surface: state.surface,
  width: state.width,
  height: state.height
});

module.exports = connect(mapStateToProps)(InputImage);
