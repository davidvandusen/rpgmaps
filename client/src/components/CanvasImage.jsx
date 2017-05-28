const React = require('react');

const bufferProps = ['imageData', 'x', 'y', 'scale', 'alpha'];

class CanvasImage extends React.Component {
  getContext() {
    return this.canvas.getContext('2d');
  }

  getBufferContext() {
    return this.bufferCanvas.getContext('2d');
  }

  draw() {
    requestAnimationFrame(() => {
      const ctx = this.getContext();
      ctx.imageSmoothingEnabled = this.props.imageSmoothingEnabled;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.props.buffers.forEach(buffer => {
        if (!buffer.imageData || !buffer.alpha) return;
        ctx.save();
        this.bufferCanvas.width = buffer.imageData.width;
        this.bufferCanvas.height = buffer.imageData.height;
        ctx.translate(buffer.x, buffer.y);
        ctx.scale(buffer.scale, buffer.scale);
        ctx.globalAlpha = buffer.alpha;
        const bufferCtx = this.getBufferContext();
        bufferCtx.clearRect(0, 0, buffer.imageData.width, buffer.imageData.height);
        bufferCtx.putImageData(buffer.imageData, 0, 0);
        ctx.drawImage(this.bufferCanvas, 0, 0);
        ctx.restore();
      });
    });
  }

  componentDidMount() {
    this.bufferCanvas = document.createElement('canvas');
    this.draw();
  }

  shouldCanvasRedraw(prevProps) {
    if (prevProps.width !== this.props.width || prevProps.height !== this.props.height) return true;
    if (prevProps.imageSmoothingEnabled !== this.props.imageSmoothingEnabled) return true;
    const oldBuffers = prevProps.buffers;
    const newBuffers = this.props.buffers;
    if (oldBuffers.length !== newBuffers.length) return true;
    for (let i = 0; i < oldBuffers.length; i++) {
      for (const prop of bufferProps) {
        if (oldBuffers[i][prop] !== newBuffers[i][prop]) return true;
      }
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (this.shouldCanvasRedraw(prevProps)) this.draw();
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
