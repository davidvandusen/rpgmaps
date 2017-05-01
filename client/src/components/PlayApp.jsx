require('../../styles/play-app.scss');
const React = require('react');
const OutputMap = require('./OutputMap.jsx');
const mapDataFactory = require('../common/mapDataFactory');
const Token = require('./Token.jsx');

class PlayApp extends React.Component {
  constructor(props) {
    super(props);
    this.roomName = location.pathname.substring(1);
    this.state = {
      mapData: undefined,
      title: `Play ${this.roomName} - RPG Maps`,
      tokens: []
    };
    this.createToken = this.createToken.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this, undefined);
  }

  createToken() {
    const tokens = this.state.tokens.concat({
      key: Math.random()
    });
    this.setState({tokens});
  }

  componentDidMount() {
    this.socket = io();
    this.socket.emit('joinRoom', {
      roomName: this.roomName,
      to: 'play'
    });
    this.socket.on('publishMap', mapData => {
      mapDataFactory.hydrateJSON(mapData);
      this.setState({mapData});
    });
    window.addEventListener('resize', this.forceUpdate);
  }

  componentWillUnmount() {
    this.socket.disconnect();
    window.removeEventListener('resize', this.forceUpdate);
  }

  render() {
    document.title = this.state.title;
    return (
      <div className="full-screen-container">
        <OutputMap
          ref={c => this.outputMap = c}
          config={this.props.config}
          mapData={this.state.mapData}>
          <p className="content-placeholder">No map published yet. To publish a map to this page, go to <a href={location.href + '/edit'}>{location.href + '/edit'}</a></p>
        </OutputMap>
        <div className="token-layer">
          <div
            className="token-add"
            title="Create a new token"
            onClick={this.createToken} />
          <div className="tokens">
              {this.state.tokens.map(token => <Token {...token} />)}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = PlayApp;
