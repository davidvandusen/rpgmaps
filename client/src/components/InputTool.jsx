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
    if (this.props.mouseX !== undefined && this.props.mouseY !== undefined) {
      if (this.props.tool === 'BRUSH' && this.props.mouseInWorkspace) {
        ctx.beginPath();
        ctx.arc(this.props.mouseX, this.props.mouseY, this.props.brushSize * this.props.scale / 2, 0, 2 * Math.PI);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 0.75;
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
  brushSize: state.settings.input.brushSize,
  height: state.ui.workspace.height,
  mouseX: state.ui.mouse.x,
  mouseY: state.ui.mouse.y,
  mouseInWorkspace: state.ui.mouse.inWorkspace,
  scale: state.ui.workspace.scale,
  tool: state.settings.input.tool,
  width: state.ui.workspace.width
});

module.exports = connect(mapStateToProps)(InputTool);
