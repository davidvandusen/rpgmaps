const makeKeymap = require('./play-keymap');
const registerCommonUIEvents = require('./common-events');
const mapDataFactory = require('../common/mapDataFactory');
const {setRoomName} = require('../actions/controlsActions');
const {setOutputOpacity, setCrossfadeOpacity, processInput, setInputBuffer} = require('../actions/graphicsActions');

module.exports = ({dispatch, getState, subscribe}) => {
  subscribe(() => {
    const roomName = getState().ui.controls.roomName;
    window.name = `play/${roomName}`;
    document.title = `Play ${roomName} - RPG Maps`;
  });

  const roomName = location.pathname.substring(1);
  dispatch(setRoomName(roomName));

  const socket = io();
  socket.emit('joinRoom', {roomName, to: 'play'});
  socket.on('publishMap', mapData => {
    mapDataFactory.hydrateJSON(mapData);
    dispatch(setInputBuffer(mapDataFactory(getState().settings.input.terrains).toImageData(mapData)));
    dispatch(processInput());
  });

  dispatch(setOutputOpacity(1));
  dispatch(setCrossfadeOpacity(0));

  const keymap = makeKeymap(dispatch);
  registerCommonUIEvents(dispatch, keymap);
};
