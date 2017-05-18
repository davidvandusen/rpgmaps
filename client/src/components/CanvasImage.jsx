const React = require('react');

class CanvasImage extends React.Component {
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
    ctx.scale(this.props.scale / this.props.outputQuality, this.props.scale / this.props.outputQuality);
    this.getBufferContext().putImageData(this.props.buffer, 0, 0);
    ctx.drawImage(this.bufferCanvas, 0, 0);
    ctx.restore();
  }

  onUpdate() {
    this.bufferCanvas.width = this.props.buffer.width;
    this.bufferCanvas.height = this.props.buffer.height;
    if (this.props.opacity > 0) requestAnimationFrame(this.draw.bind(this));
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
        className={this.props.className}
        width={this.props.width}
        height={this.props.height}
        style={canvasStyle} />
    );
  }
}

module.exports = CanvasImage;
