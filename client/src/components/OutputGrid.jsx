const React = require('react');
const {connect} = require('react-redux');

class OutputGrid extends React.Component {
  getContext() {
    return this.canvas.getContext('2d');
  }

  setGridStyle(ctx) {
    ctx.strokeStyle = this.props.grid.color;
    ctx.lineWidth = this.props.grid.lineWidth;
    ctx.lineJoin = 'miter';
    ctx.lineCap = 'butt';
    ctx.setLineDash([]);
  }

  drawSquareGrid(ctx) {
    ctx.beginPath();
    for (let i = this.props.grid.spacing; i < this.props.surface.width; i += this.props.grid.spacing) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, this.canvas.height);
    }
    for (let i = this.props.grid.spacing; i < this.props.surface.height; i += this.props.grid.spacing) {
      ctx.moveTo(0, i);
      ctx.lineTo(this.canvas.width, i);
    }
    this.setGridStyle(ctx);
    ctx.stroke();
  }

  drawFlatHexGrid(ctx) {
    let offset = false;
    ctx.beginPath();
    const height = this.props.grid.spacing * Math.sqrt(3) * 0.5;
    for (let y = 0; y < this.props.surface.height; y += height * 0.5) {
      for (let x = this.props.grid.spacing * (offset ? 0.25 : 1); x < this.props.surface.width; x += this.props.grid.spacing * 1.5) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + this.props.grid.spacing * 0.5, y);
        ctx.moveTo(x, y);
        ctx.lineTo(x - this.props.grid.spacing * 0.25, y + height * 0.5);
        ctx.moveTo(x, y);
        ctx.lineTo(x - this.props.grid.spacing * 0.25, y - height * 0.5);
      }
      offset = !offset;
    }
    this.setGridStyle(ctx);
    ctx.stroke();
  }

  drawPointyHexGrid(ctx) {
    let offset = false;
    ctx.beginPath();
    const width = this.props.grid.spacing * Math.sqrt(3) * 0.5;
    for (let y = 0; y < this.props.surface.height; y += this.props.grid.spacing * 0.75) {
      for (let x = width * (offset ? 0.5 : 0); x < this.props.surface.width; x += width) {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + this.props.grid.spacing * 0.5);
        ctx.moveTo(x, y);
        ctx.lineTo(x + width * 0.5, y - this.props.grid.spacing * 0.25);
        ctx.moveTo(x, y);
        ctx.lineTo(x - width * 0.5, y - this.props.grid.spacing * 0.25);
      }
      offset = !offset;
    }
    this.setGridStyle(ctx);
    ctx.stroke();
  }

  draw() {
    if (!this.props.grid.show) return;
    const ctx = this.getContext();
    ctx.save();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.translate(this.props.surface.x, this.props.surface.y);
    ctx.scale(this.props.surface.scale, this.props.surface.scale);
    ctx.rect(0, 0, this.props.surface.width, this.props.surface.height);
    ctx.clip();
    if (this.props.grid.type === 'square') {
      this.drawSquareGrid(ctx);
    }
    if (this.props.grid.type === 'pointy-top-hex') {
      this.drawPointyHexGrid(ctx);
    }
    if (this.props.grid.type === 'flat-top-hex') {
      this.drawFlatHexGrid(ctx);
    }
    ctx.restore();
  }

  componentDidMount() {
    if (this.props.grid.show) this.draw();
  }

  componentDidUpdate() {
    if (this.props.grid.show) this.draw();
  }

  render() {
    const canvasStyle = {
      width: this.props.width + 'px',
      height: this.props.height + 'px',
      display: this.props.grid.show ? 'block' : 'none'
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
  grid: state.grid,
  surface: state.surface,
  width: state.width,
  height: state.height
});

module.exports = connect(mapStateToProps)(OutputGrid);
