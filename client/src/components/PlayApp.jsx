import React, {Component} from 'react';
import '../../styles/edit-app.scss';
import OutputMap from './OutputMap.jsx';
import AreaMask from "../lib/AreaMask";

export default class PlayApp extends Component {
  constructor(props) {
    super(props);
    this.roomName = location.pathname.substring(1);
    this.state = {
      areas: undefined,
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
      this.setState({areas: mapData.areas});
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
          areas={this.state.areas}>
          <p>No map published yet. To publish a map to this page, go to <a href={location.href + '/edit'}>{location.href + '/edit'}</a></p>
        </OutputMap>
      </div>
    );
  }
}
