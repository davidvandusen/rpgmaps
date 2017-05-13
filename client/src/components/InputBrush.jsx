const React = require('react');
const {connect} = require('react-redux');

class InputBrush extends React.Component {
  getContext() {
    return this.canvas.getContext('2d');
  }

  draw() {
    const ctx = this.getContext();
    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (this.props.mouse.x !== undefined && this.props.mouse.y !== undefined) {
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.arc(this.props.mouse.x, this.props.mouse.y, this.props.brush.size * this.props.surface.scale, 0, 2 * Math.PI);
      ctx.strokeStyle = 'black';
      ctx.stroke();
      ctx.arc(this.props.mouse.x, this.props.mouse.y, this.props.brush.size * this.props.surface.scale - 0.5, 0, 2 * Math.PI);
      ctx.strokeStyle = 'white';
      ctx.stroke();
    }
    ctx.restore();
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  render() {
    const canvasStyle = {
      width: this.props.width + 'px',
      height: this.props.height + 'px',
    };
    return (
      <canvas
        ref={el => this.canvas = el}
        className="input-brush"
        width={this.props.width}
        height={this.props.height}
        style={canvasStyle}/>
    );
  }
}

const mapStateToProps = state => ({
  surface: state.surface,
  mouse: state.mouse,
  brush: state.brush,
  width: state.width,
  height: state.height
});

module.exports = connect(mapStateToProps)(InputBrush);
