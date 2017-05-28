const React = require('react');

class Token extends React.Component {
  render() {
    const positionObject = {};
    if (this.props.z !== undefined) positionObject.zIndex = this.props.z;
    if (this.props.x !== undefined) positionObject.left = `${this.props.x}px`;
    if (this.props.y !== undefined) positionObject.top = `${this.props.y}px`;
    const colorObject = {background: backgroundColor(this.props.name)};
    return (
      <div
        className="token"
        style={positionObject}
        onMouseDown={this.props.grabToken}
        onMouseUp={this.props.releaseToken}>
        <div className="token-id" style={colorObject}>{this.props.name}</div>
        <div className="token-banner">{this.props.description}</div>
      </div>
    );
  }
}

function backgroundColor(str) {
  const sumOfCharCodes = Array.from(str).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const colorIndex = sumOfCharCodes % Token.colors.length;
  return Token.colors[colorIndex];
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
