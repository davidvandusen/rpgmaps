const React = require('react');
const {connect} = require('react-redux');

class InputPaint extends React.Component {
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
    ctx.translate(this.props.surface.x, this.props.surface.y);
    ctx.scale(this.props.surface.scale, this.props.surface.scale);
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
        className="input-paint"
        width={this.props.width}
        height={this.props.height}
        style={canvasStyle} />
    );
  }
}

const mapStateToProps = state => ({
  imageSmoothingEnabled: true,
  opacity: 1,
  buffer: state.paintBuffer,
  surface: state.surface,
  width: state.width,
  height: state.height
});

module.exports = connect(mapStateToProps)(InputPaint);
