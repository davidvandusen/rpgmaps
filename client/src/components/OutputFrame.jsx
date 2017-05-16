const React = require('react');
const {connect} = require('react-redux');

class OutputFrame extends React.Component {
  getContext() {
    return this.canvas.getContext('2d');
  }

  draw() {
    const ctx = this.getContext();
    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(this.props.surface.x, this.props.surface.y);
    ctx.scale(this.props.surface.scale, this.props.surface.scale);
    ctx.beginPath();
    const frameWidth = this.props.frame.width;
    const surfaceWidth = this.props.surface.width;
    const surfaceHeight = this.props.surface.height;
    ctx.rect(frameWidth, 0, surfaceWidth - 2 * frameWidth, frameWidth);
    ctx.rect(0, frameWidth, frameWidth, surfaceHeight - 2 * frameWidth);
    ctx.rect(surfaceWidth - frameWidth, frameWidth, frameWidth, surfaceHeight - 2 * frameWidth);
    ctx.rect(frameWidth, surfaceHeight - frameWidth, surfaceWidth - 2 * frameWidth, frameWidth);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.beginPath();
    ctx.rect(0, 0, frameWidth, frameWidth);
    ctx.rect(surfaceWidth - frameWidth, 0, frameWidth, frameWidth);
    ctx.rect(0, surfaceHeight - frameWidth, frameWidth, frameWidth);
    ctx.rect(surfaceWidth - frameWidth, surfaceHeight - frameWidth, frameWidth, frameWidth);
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.restore();
  }

  componentDidMount() {
    if (this.props.frame.show) this.draw();
  }

  componentDidUpdate() {
    if (this.props.frame.show) this.draw();
  }

  render() {
    const canvasStyle = {
      width: this.props.width + 'px',
      height: this.props.height + 'px',
      display: this.props.frame.show ? 'block' : 'none'
    };
    return (
      <canvas
        ref={el => this.canvas = el}
        className="output-frame"
        width={this.props.width}
        height={this.props.height}
        style={canvasStyle} />
    );
  }
}

const mapStateToProps = state => ({
  frame: state.frame,
  surface: state.surface,
  width: state.width,
  height: state.height
});

module.exports = connect(mapStateToProps)(OutputFrame);
