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
    if (this.props.mouse.x !== undefined && this.props.mouse.y !== undefined) {
      ctx.beginPath();
      if (this.mouseOrigin && this.mouseOrigin.x !== undefined && this.mouseOrigin.y !== undefined) {
        const dist = distance(this.mouseOrigin.x, this.mouseOrigin.y, this.props.mouse.x, this.props.mouse.y);
        if (dist > this.props.brush.size / 2) {
          const steps = dist / this.props.brush.size * Math.PI;
          const dx = (this.props.mouse.x - this.mouseOrigin.x) / steps;
          const dy = (this.props.mouse.y - this.mouseOrigin.y) / steps;
          for (let step = 1; step < steps; step++) {
            ctx.arc(this.mouseOrigin.x + dx * step, this.mouseOrigin.y + dy * step, this.props.brush.size, 0, 2 * Math.PI);
          }
        }
      }
      ctx.arc(this.props.mouse.x, this.props.mouse.y, this.props.brush.size, 0, 2 * Math.PI);
      ctx.fillStyle = 'black';
      ctx.fill();
    }
    this.mouseOrigin = this.props.mouse;
  }

  clear() {
    if (this.props.captureStroke) return;
    const ctx = this.getContext();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    delete this.mouseOrigin;
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    if (!this.props.captureStroke && this.captureStroke !== this.props.captureStroke) {
      // TODO dispatch an action that changes the input image
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
  mouse: state.mouse,
  brush: state.brush,
  width: state.width,
  height: state.height
});

module.exports = connect(mapStateToProps)(InputPaint);
