const React = require('react');
const {connect} = require('react-redux');

class InputTool extends React.Component {
  getContext() {
    return this.canvas.getContext('2d');
  }

  draw() {
    const ctx = this.getContext();
    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (this.props.mouse.x !== undefined && this.props.mouse.y !== undefined) {
      if (this.props.tool === 'BRUSH') {
        ctx.beginPath();
        ctx.arc(this.props.mouse.x, this.props.mouse.y, this.props.brush.size * this.props.surface.scale / 2, 0, 2 * Math.PI);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
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
      cursor: 'none'
    };
    return (
      <canvas
        ref={el => this.canvas = el}
        className="input-tool"
        width={this.props.width}
        height={this.props.height}
        style={canvasStyle} />
    );
  }
}

const mapStateToProps = state => ({
  tool: state.tool,
  surface: state.surface,
  mouse: state.mouse,
  brush: state.brush,
  width: state.width,
  height: state.height
});

module.exports = connect(mapStateToProps)(InputTool);
