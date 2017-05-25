const makeKeymap = require('./edit-keymap');
const registerCommonUIEvents = require('./common-events');
const mapDataFactory = require('../common/mapDataFactory');
const {resetInputBuffer, setInputBuffer, resetPaintBuffer, setOutputOpacity, setCrossfadeOpacity, setInputOpacity, setPaintOpacity, processInput} = require('../actions/graphicsActions');
const {setRoomName} = require('../actions/controlsActions');

module.exports = ({dispatch, getState}) => {
  const roomName = location.pathname.substring(1, location.pathname.indexOf('/', 1));
  window.name = `edit/${roomName}`;
  dispatch(setRoomName(roomName));

  // TODO show status in title (save status to state and add listener for changes)
  document.title = `Edit ${roomName} - RPG Maps`;

  dispatch(setOutputOpacity(1));
  dispatch(setCrossfadeOpacity(0));
  dispatch(setInputOpacity(0));
  dispatch(setPaintOpacity(0.75));

  dispatch(resetPaintBuffer());

  const state = getState();
  const mapData = state.data.mapData;
  if (mapData) dispatch(setInputBuffer(mapDataFactory(state.settings.input.terrains).toImageData(mapData)));
  else dispatch(resetInputBuffer());
  dispatch(processInput());

  const keymap = makeKeymap(dispatch);
  registerCommonUIEvents(dispatch, keymap);
};
