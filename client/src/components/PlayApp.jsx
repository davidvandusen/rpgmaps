require('../../styles/edit-app.scss');
const React = require('react');
const OutputMap = require('./OutputMap.jsx');
const AreaMask = require('../common/AreaMask');

class PlayApp extends React.Component {
  constructor(props) {
    super(props);
    this.roomName = location.pathname.substring(1);
    this.state = {
      mapData: undefined,
      title: `Play ${this.roomName} - RPG Maps`
    };
  }

  componentDidMount() {
    this.socket = io();
    this.socket.emit('joinRoom', {
      roomName: this.roomName,
      to: 'play'
    });
    this.socket.on('publishMap', mapData => {
      mapData.areas.forEach(area => area.mask = AreaMask.fromJSON(area.mask));
      this.setState({mapData});
    });
  }

  componentWillUnmount() {
    this.socket.disconnect();
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
      </div>
    );
  }
}

module.exports = PlayApp;
