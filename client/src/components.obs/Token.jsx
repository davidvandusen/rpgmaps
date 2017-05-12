const React = require('react');

class Token extends React.Component {
  constructor(props) {
    super(props);
    this.offset = {
      x: 0,
      y: 0
    };
    this.mouse = {
      x: undefined,
      y: undefined,
      buttons: []
    };
    this.updateMousePosition = this.updateMousePosition.bind(this);
    this.updateMouseButtonsDown = this.updateMouseButtonsDown.bind(this);
    this.updateMouseButtonsUp = this.updateMouseButtonsUp.bind(this);
    this.dragToken = this.dragToken.bind(this);
  }

  updateMousePosition(event) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  updateMouseButtonsDown(event) {
    if (event.button === 0) this.mouse.buttons[0] = true;
    const elBounds = this.el.getBoundingClientRect();
    this.offset.x = event.clientX - elBounds.left;
    this.offset.y = event.clientY - elBounds.top;
  }

  updateMouseButtonsUp(event) {
    if (event.button === 0) this.mouse.buttons[0] = false;
  }

  dragToken() {
    if (!this.mouse.buttons[0]) return;
    const elBounds = this.el.getBoundingClientRect();
    this.props.updateToken(this.props.id, {
      x: this.mouse.x - this.offset.x + elBounds.width / 2,
      y: this.mouse.y - this.offset.y + elBounds.height / 2
    });
  }

  componentDidMount() {
    const elBounds = this.el.getBoundingClientRect();
    this.setState({
      x: elBounds.left + elBounds.width / 2,
      y: elBounds.top + elBounds.height / 2
    });
    document.addEventListener('mousemove', this.updateMousePosition, true);
    this.grip.addEventListener('mousedown', this.updateMouseButtonsDown, true);
    document.addEventListener('mouseup', this.updateMouseButtonsUp, true);
    document.addEventListener('mousemove', this.dragToken);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.updateMousePosition, true);
    this.grip.removeEventListener('mousedown', this.updateMouseButtonsDown, true);
    document.removeEventListener('mouseup', this.updateMouseButtonsUp, true);
    document.removeEventListener('mousemove', this.dragToken);
  }

  backgroundColor() {
    const sumOfCharCodes = Array.from(this.props.name).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colorIndex = sumOfCharCodes % Token.colors.length;
    return Token.colors[colorIndex];
  }

  render() {
    const positionObject = {};
    positionObject.zIndex = this.props.index;
    if (this.props.x !== undefined) positionObject.left = `${this.props.x}px`;
    if (this.props.y !== undefined) positionObject.top = `${this.props.y}px`;
    const colorObject = {
      background: this.backgroundColor()
    };
    return (
      <div
        ref={el => this.el = this.grip = el}
        onClick={this.props.updateToken.bind(undefined, this.props.id, {})}
        className="token"
        style={positionObject}>
        <div className="token-id" style={colorObject}>{this.props.name}</div>
        <div className="token-banner">{this.props.banner}</div>
      </div>
    );
  }
}

Token.colors = [
  '#000000',
  '#0e6251',
  '#0b5345',
  '#186a3b',
  '#145a32',
  '#1b4f72',
  '#154360',
  '#512e5f',
  '#4a235a',
  '#1b2631',
  '#17202a',
  '#7d6608',
  '#7e5109',
  '#784212',
  '#6e2c00',
  '#78281f',
  '#641e16',
  '#7b7d7d',
  '#626567',
  '#4d5656',
  '#424949'
];

module.exports = Token;
