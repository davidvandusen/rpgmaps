const makeKeymap = require('./play-keymap');
const registerCommonUIEvents = require('./common-events');
const {setRoomName} = require('../actions/controlsActions');
const {setOutputOpacity, setCrossfadeOpacity} = require('../actions/graphicsActions');

module.exports = ({dispatch}) => {
  const roomName = location.pathname.substring(1);
  window.name = `play/${roomName}`;
  dispatch(setRoomName(roomName));

  // TODO show status in title (save status to state and add listener for changes)
  document.title = `Play ${roomName} - RPG Maps`;

  dispatch(setOutputOpacity(1));
  dispatch(setCrossfadeOpacity(0));

  const keymap = makeKeymap(dispatch);
  registerCommonUIEvents(dispatch, keymap);
};
