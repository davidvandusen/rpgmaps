const React = require('react');
const {connect} = require('react-redux');

class InputImage extends React.Component {
  getContext() {
    return this.canvas.getContext('2d');
  }

  getBufferContext() {
    return this.bufferCanvas.getContext('2d');
  }

  draw() {
    const ctx = this.getContext();
    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(this.props.x, this.props.y);
    ctx.scale(this.props.scale, this.props.scale);
    const bufferCtx = this.getBufferContext();
    bufferCtx.putImageData(this.props.buffer, 0, 0);
    ctx.drawImage(this.bufferCanvas, 0, 0);
    ctx.restore();
  }

  onUpdate() {
    this.bufferCanvas.width = this.props.buffer.width;
    this.bufferCanvas.height = this.props.buffer.height;
    this.draw();
  }

  componentDidMount() {
    this.bufferCanvas = document.createElement('canvas');
    this.getContext().imageSmoothingEnabled = this.props.imageSmoothingEnabled;
    this.onUpdate();
  }

  componentDidUpdate() {
    this.onUpdate();
  }

  render() {
    const canvasStyle = {
      width: this.props.width + 'px',
      height: this.props.height + 'px',
      opacity: this.props.opacity
    };
    return (
      <canvas
        ref={el => this.canvas = el}
        className="input-image"
        width={this.props.width}
        height={this.props.height}
        style={canvasStyle} />
    );
  }
}

const mapStateToProps = state => ({
  buffer: state.graphics.inputBuffer,
  height: state.workspace.height,
  imageSmoothingEnabled: false,
  opacity: state.settings.inputImageOpacity,
  scale: state.workspace.scale,
  surfaceWidth: state.workspace.surface.width,
  surfaceHeight: state.workspace.surface.height,
  width: state.workspace.width,
  x: state.workspace.x,
  y: state.workspace.y
});

module.exports = connect(mapStateToProps)(InputImage);
