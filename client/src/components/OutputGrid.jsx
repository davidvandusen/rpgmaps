const React = require('react');
const {connect} = require('react-redux');

class OutputGrid extends React.Component {
  getContext() {
    return this.canvas.getContext('2d');
  }

  setGridStyle(ctx) {
    ctx.strokeStyle = this.props.lineColor;
    ctx.lineWidth = this.props.lineWidth;
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.setLineDash([]);
  }

  drawSquareGrid(ctx) {
    ctx.beginPath();
    for (let i = this.props.spacing; i < this.props.surfaceWidth; i += this.props.spacing) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, ctx.canvas.height);
    }
    for (let i = this.props.spacing; i < this.props.surfaceHeight; i += this.props.spacing) {
      ctx.moveTo(0, i);
      ctx.lineTo(ctx.canvas.width, i);
    }
    this.setGridStyle(ctx);
    ctx.stroke();
  }

  drawFlatHexGrid(ctx) {
    let offset = false;
    ctx.beginPath();
    const height = this.props.spacing * Math.sqrt(3) * 0.5;
    const lastRow = this.props.surfaceHeight + this.props.spacing;
    for (let y = 0; y < lastRow; y += height * 0.5) {
      const lastCol = this.props.surfaceWidth + this.props.spacing;
      for (let x = this.props.spacing * (offset ? 0.25 : 1); x < lastCol; x += this.props.spacing * 1.5) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.props.spacing * 0.5, y);
        ctx.moveTo(x, y);
        ctx.lineTo(x - this.props.spacing * 0.25, y + height * 0.5);
        ctx.moveTo(x, y);
        ctx.lineTo(x - this.props.spacing * 0.25, y - height * 0.5);
      }
      offset = !offset;
    }
    this.setGridStyle(ctx);
    ctx.stroke();
  }

  drawPointyHexGrid(ctx) {
    let offset = false;
    ctx.beginPath();
    const width = this.props.spacing * Math.sqrt(3) * 0.5;
    const lastRow = this.props.surfaceHeight + this.props.spacing;
    for (let y = 0; y < lastRow; y += this.props.spacing * 0.75) {
      const lastCol = this.props.surfaceWidth + this.props.spacing;
      for (let x = width * (offset ? 0.5 : 0); x < lastCol; x += width) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + this.props.spacing * 0.5);
        ctx.moveTo(x, y);
        ctx.lineTo(x + width * 0.5, y - this.props.spacing * 0.25);
        ctx.moveTo(x, y);
        ctx.lineTo(x - width * 0.5, y - this.props.spacing * 0.25);
      }
      offset = !offset;
    }
    this.setGridStyle(ctx);
    ctx.stroke();
  }

  draw() {
    const ctx = this.getContext();
    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(this.props.x, this.props.y);
    ctx.scale(this.props.scale, this.props.scale);
    ctx.rect(0, 0, this.props.surfaceWidth, this.props.surfaceHeight);
    ctx.clip();
    if (this.props.type === 'square') this.drawSquareGrid(ctx);
    if (this.props.type === 'pointy-top-hex') this.drawPointyHexGrid(ctx);
    if (this.props.type === 'flat-top-hex') this.drawFlatHexGrid(ctx);
    ctx.restore();
  }

  onUpdate() {
    if (this.props.opacity > 0) requestAnimationFrame(this.draw.bind(this));
  }

  componentDidMount() {
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
        className="output-grid"
        width={this.props.width}
        height={this.props.height}
        style={canvasStyle} />
    );
  }
}

const mapStateToProps = state => ({
  lineColor: state.settings.grid.lineColor,
  lineWidth: state.settings.grid.lineWidth,
  type: state.settings.grid.type,
  spacing: state.settings.grid.spacing,
  opacity: state.settings.grid.opacity,
  surfaceWidth: state.settings.input.width,
  surfaceHeight: state.settings.input.height,
  scale: state.ui.workspace.scale,
  height: state.ui.workspace.height,
  width: state.ui.workspace.width,
  x: state.ui.workspace.x,
  y: state.ui.workspace.y
});

module.exports = connect(mapStateToProps)(OutputGrid);
