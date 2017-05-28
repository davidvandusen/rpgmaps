const React = require('react');
const {connect} = require('react-redux');
const Token = require('./Token.jsx');
const {grabToken, releaseToken} = require('../actions/controlsActions');

class Tokens extends React.Component {
  render() {
    return (
      <div className="tokens">
        {this.props.tokens.map(token => (
          <Token
            key={token._id}
            x={token.x * this.props.scale + this.props.x}
            y={token.y * this.props.scale + this.props.y}
            name={token.name}
            description={token.description}
            grabToken={() => this.props.grabToken(token._id)}
            releaseToken={() => this.props.releaseToken()} />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  scale: state.ui.workspace.scale,
  x: state.ui.workspace.x,
  y: state.ui.workspace.y,
  tokens: state.settings.tokens
});

const mapDispatchToProps = dispatch => ({
  grabToken: _id => dispatch(grabToken(_id)),
  releaseToken: () => dispatch(releaseToken())
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Tokens);
