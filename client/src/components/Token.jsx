const React = require('react');

class Token extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: undefined,
      y: undefined
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
  }

  updateMouseButtonsUp(event) {
    if (event.button === 0) this.mouse.buttons[0] = false;
  }

  dragToken() {
    if (!this.mouse.buttons[0]) return;
    this.setState({
      x: this.mouse.x,
      y: this.mouse.y
    });
  }

  componentDidMount() {
    const elBounds = this.el.getBoundingClientRect();
    this.setState({
      x: elBounds.left + 25,
      y: elBounds.top + 25
    });
    document.addEventListener('mousemove', this.updateMousePosition, true);
    this.el.addEventListener('mousedown', this.updateMouseButtonsDown, true);
    document.addEventListener('mouseup', this.updateMouseButtonsUp, true);
    document.addEventListener('mousemove', this.dragToken);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.updateMousePosition, true);
    this.el.removeEventListener('mousedown', this.updateMouseButtonsDown, true);
    document.removeEventListener('mouseup', this.updateMouseButtonsUp, true);
    document.removeEventListener('mousemove', this.dragToken);
  }

  render() {
    const styleObject = {};
    if (this.state.x !== undefined) styleObject.left = `${this.state.x}px`;
    if (this.state.y !== undefined) styleObject.top = `${this.state.y}px`;
    if (this.props.z !== undefined) styleObject.zIndex = this.props.zIndex;
    const classNames = ['token'];
    return (
      <div
        ref={el => this.el = el}
        className={classNames.join(' ')}
        style={styleObject}>
        <div
          className="token-id"
          contentEditable="true"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false">{this.props.id}</div>
        <div
          className="token-banner"
          contentEditable="true"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false">{this.props.name}</div>
      </div>
    );
  }
}

module.exports = Token;
