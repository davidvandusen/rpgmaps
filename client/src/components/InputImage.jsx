const React = require('react');
const {connect} = require('react-redux');

class InputImage extends React.Component {
  getContext() {
    return this.canvas.getContext('2d');
  }

  draw() {
    const ctx = this.getContext();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.translate(this.props.surface.x, this.props.surface.y);
    ctx.scale(this.props.surface.scale, this.props.surface.scale);
    ctx.beginPath();
    ctx.rect(0, 0, this.props.surface.width, this.props.surface.height);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1 / this.props.surface.scale;
    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
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
        className="input-image"
        width={this.props.width}
        height={this.props.height}
        style={canvasStyle}/>
    );
  }
}

const mapStateToProps = state => ({
  surface: state.surface,
  width: state.width,
  height: state.height
});

module.exports = connect(mapStateToProps)(InputImage);
