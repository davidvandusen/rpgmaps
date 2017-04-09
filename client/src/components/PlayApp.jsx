import React, {Component} from 'react';

export default class PlayApp extends Component {
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
      console.log(mapData);
    });
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  render() {
    document.title = this.state.title;
    return (<div>
      {this.state.mapData ? (
        <div>
          Here's comes the map!
        </div>
      ) : (
        <div>
          <p>No map published yet. To publish a map to this page, go to <a href={location.href + '/edit'}>{location.href + '/edit'}</a></p>
        </div>
      )}
    </div>);
  }
}
