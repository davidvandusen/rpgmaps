const React = require('react');
const {connect} = require('react-redux');
const {distance} = require('../common/geometry');

class InputPaint extends React.Component {
  getContext() {
    return this.canvas.getContext('2d');
  }

  draw() {
    if (!this.props.captureStroke) return;
    const ctx = this.getContext();
    ctx.save();
    if (this.props.mouse.x !== undefined && this.props.mouse.y !== undefined) {
      ctx.translate(this.props.surface.x, this.props.surface.y);
      ctx.scale(this.props.surface.scale, this.props.surface.scale);
      ctx.beginPath();
      ctx.rect(0, 0, this.props.surface.width, this.props.surface.height);
      ctx.clip();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.beginPath();
      if (this.mouseOrigin && this.mouseOrigin.x !== undefined && this.mouseOrigin.y !== undefined) {
        const dist = distance(this.mouseOrigin.x, this.mouseOrigin.y, this.props.mouse.x, this.props.mouse.y);
        if (dist > this.props.brush.size / 2) {
          const steps = dist / this.props.brush.size * Math.PI;
          const dx = (this.props.mouse.x - this.mouseOrigin.x) / steps;
          const dy = (this.props.mouse.y - this.mouseOrigin.y) / steps;
          for (let step = 1; step < steps; step++) {
            ctx.arc(this.mouseOrigin.x + dx * step, this.mouseOrigin.y + dy * step, this.props.brush.size * this.props.surface.scale, 0, 2 * Math.PI);
          }
        }
      }
      ctx.arc(this.props.mouse.x, this.props.mouse.y, this.props.brush.size * this.props.surface.scale, 0, 2 * Math.PI);
      ctx.fillStyle = 'black';
      ctx.fill();
    }
    this.mouseOrigin = this.props.mouse;
    ctx.restore();
  }

  clear() {
    if (this.props.captureStroke) return;
    const ctx = this.getContext();
    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    delete this.mouseOrigin;
    ctx.restore();
  }

  componentDidMount() {
    this.draw();
  }

  calculateChangeToInputImage() {
    const ctx = this.getContext();
    const inputPixelIndices = [];
    if (this.props.surface.x > ctx.canvas.width || this.props.surface.y > ctx.canvas.height) {
      return inputPixelIndices;
    }
    const sliceX = Math.floor(Math.max(0, this.props.surface.x));
    const sliceY = Math.floor(Math.max(0, this.props.surface.y));
    const sliceW = Math.floor(Math.min(ctx.canvas.width - sliceX, this.props.surface.width * this.props.surface.scale));
    const sliceH = Math.floor(Math.min(ctx.canvas.height - sliceY, this.props.surface.height * this.props.surface.scale));
    if (this.props.surface.x + sliceW <= 0 || this.props.surface.y + sliceH <= 0) {
      return inputPixelIndices;
    }
    const imageData = ctx.getImageData(sliceX, sliceY, sliceW, sliceH);
    const pixelData = imageData.data;
    const offsetX = Math.min(0, this.props.surface.x);
    const offsetY = Math.min(0, this.props.surface.y);
    for (let i = 0, len = this.props.surface.width * this.props.surface.height; i < len; i++) {
      const x = i % this.props.surface.width + 0.5;
      const y = Math.floor(i / this.props.surface.width) + 0.5;
      const scaledX = x * this.props.surface.scale;
      const scaledY = y * this.props.surface.scale;
      const adjustedX = Math.floor(scaledX + offsetX);
      const adjustedY = Math.floor(scaledY + offsetY);
      if (adjustedX < 0 || adjustedY < 0 || adjustedX > sliceW || adjustedY > sliceH) {
        continue;
      }
      const pixelIndex = Math.floor(adjustedX + adjustedY * sliceW) * 4;
      const alpha = pixelData[pixelIndex + 3];
      if (alpha >= 0x80) inputPixelIndices.push(i);
    }
    return inputPixelIndices;
  }

  componentDidUpdate() {
    if (!this.props.captureStroke && this.captureStroke !== this.props.captureStroke) {
      const indices = this.calculateChangeToInputImage();
      this.props.paintInput(indices);
      this.clear();
    } else {
      this.draw();
    }
    this.captureStroke = this.props.captureStroke;
  }

  render() {
    const canvasStyle = {
      width: this.props.width + 'px',
      height: this.props.height + 'px',
    };
    return (
      <canvas
        ref={el => this.canvas = el}
        className="input-paint"
        width={this.props.width}
        height={this.props.height}
        style={canvasStyle}/>
    );
  }
}

const mapStateToProps = state => ({
  captureStroke: state.captureStroke,
  surface: state.surface,
  mouse: state.mouse,
  brush: state.brush,
  width: state.width,
  height: state.height
});

const mapDispatchToProps = dispatch => ({
  paintInput: indices => dispatch({
    type: 'PAINT_INPUT',
    payload: {indices}
  })
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(InputPaint);
