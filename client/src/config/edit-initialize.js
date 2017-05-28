const makeKeymap = require('./edit-keymap');
const registerCommonUIEvents = require('./common-events');
const mapDataFactory = require('../common/mapDataFactory');
const {resetInputBuffer, setInputBuffer, resetPaintBuffer, setOutputOpacity, setCrossfadeOpacity, setInputOpacity, setPaintOpacity, processInput} = require('../actions/graphicsActions');
const {setRoomName} = require('../actions/controlsActions');
const {setTool} = require('../actions/inputActions');

module.exports = ({dispatch, getState, subscribe}) => {
  const state = getState();

  subscribe(() => {
    const roomName = getState().ui.controls.roomName;
    window.name = `edit/${roomName}`;
    document.title = `Edit ${roomName} - RPG Maps`;
  });

  const roomName = location.pathname.substring(1, location.pathname.indexOf('/', 1));
  dispatch(setRoomName(roomName));

  const socket = io();
  socket.emit('joinRoom', {roomName, to: 'edit'});
  socket.on('joinedRoom', message => {
    if (message.to === 'play' && state.data.publishedMap) {
      socket.emit('publishMap', state.data.publishedMap);
    }
  });

  let previousMap = getState().data.publishedMap;
  if (previousMap) {
    socket.emit('publishMap', previousMap);
  }
  subscribe(() => {
    const publishedMap = getState().data.publishedMap;
    if (publishedMap !== previousMap) {
      socket.emit('publishMap', publishedMap);
    }
    previousMap = publishedMap;
  });

  dispatch(setOutputOpacity(1));
  dispatch(setCrossfadeOpacity(0));
  dispatch(setInputOpacity(0));
  dispatch(setPaintOpacity(0.75));

  dispatch(resetPaintBuffer());

  dispatch(setTool('BRUSH'));

  const mapData = state.data.mapData;
  if (mapData) dispatch(setInputBuffer(mapDataFactory(state.settings.input.terrains).toImageData(mapData)));
  else dispatch(resetInputBuffer());
  dispatch(processInput());

  const keymap = makeKeymap(dispatch);
  registerCommonUIEvents(dispatch, keymap);
};
