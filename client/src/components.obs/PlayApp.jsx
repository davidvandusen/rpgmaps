require('../../styles.obs/play-app.scss');
const React = require('react');
const OutputMap = require('./OutputMap.jsx');
const PlayControls = require('./PlayControls.jsx');
const Bento = require('./Bento.jsx');
const mapDataFactory = require('../actions/mapDataFactory');
const Token = require('./Token.jsx');
const persistence = require('../common/persistence');

class PlayApp extends React.Component {
  constructor(props) {
    super(props);
    this.roomName = location.pathname.substring(1);
    this.state = Object.assign({
      mapData: undefined,
      title: `Play ${this.roomName} - RPG Maps`,
      grid: this.props.config.output.grid.default,
      tokens: []
    }, persistence.load('persistentPlayAppSettings'));
    this.changeGrid = this.changeGrid.bind(this);
    this.createToken = this.createToken.bind(this);
    this.mapGeometryChanged = this.mapGeometryChanged.bind(this);
    this.updateToken = this.updateToken.bind(this);
    this.deleteToken = this.deleteToken.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this, undefined);
  }

  changeGrid(grid) {
    this.setState({grid});
  }

  createToken() {
    const tokens = [{
      id: Math.random(),
      name: '',
      banner: '',
      x: undefined,
      y: undefined
    }].concat(this.state.tokens);
    this.setState({tokens});
  }

  updateToken(id, newState) {
    const tokens = this.state.tokens;
    const tokenIndex = tokens.findIndex(token => token.id === id);
    const token = tokens[tokenIndex];
    Object.assign(token, newState);
    tokens.splice(tokenIndex, 1);
    tokens.unshift(token);
    this.setState({tokens});
  }

  deleteToken(id) {
    this.state.tokens.splice(this.state.tokens.findIndex(token => token.id === id), 1);
    this.setState({tokens: this.state.tokens});
  }

  componentDidUpdate(prevProps, prevState) {
    const settings = PlayApp.persistentSettings.reduce((persistentSettings, key) => {
      persistentSettings[key] = this.state[key];
      return persistentSettings;
    }, {});
    persistence.save('persistentPlayAppSettings', settings);
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

  mapGeometryChanged() {
    this.outputMap.forceUpdate();
  }

  render() {
    document.title = this.state.title;
    return (
      <div className="full-screen-container">
        <Bento
          geometryChanged={this.mapGeometryChanged}
          orientation="vertical"
          defaultOffsetPixels={150}
          minOffsetPixels={130}
          maxOffsetPixels={300}>
          <PlayControls
            createToken={this.createToken}
            updateToken={this.updateToken}
            deleteToken={this.deleteToken}
            changeGrid={this.changeGrid}
            config={this.props.config}
            tokens={this.state.tokens}
            grid={this.state.grid} />
          <OutputMap
            ref={c => this.outputMap = c}
            config={this.props.config}
            grid={this.state.grid}
            showScale={true}
            mapData={this.state.mapData}>
            <p className="content-placeholder">No map published yet. To publish a map to this page, go to <a
              href={location.href + '/edit'}>{location.href + '/edit'}</a></p>
          </OutputMap>
        </Bento>
        <div className="token-layer">
          <div className="tokens">
              {this.state.tokens.map((token, i, list) =>
                <Token
                  updateToken={this.updateToken}
                  index={list.length - i}
                  key={token.id}
                  {...token} />
              )}
          </div>
        </div>
      </div>
    );
  }
}

PlayApp.persistentSettings = ['grid', 'tokens'];

module.exports = PlayApp;
