const makeKeymap = require('./edit-keymap');
const registerCommonEvents = require('./common-events');
const actionCreators = require('../actions/actionCreators');

module.exports = ({dispatch}) => {
  const roomName = location.pathname.substring(1, location.pathname.indexOf('/', 1));
  document.title = `Edit ${roomName} - RPG Maps`;

  // Perform an initial set of actions to bring the initial state to one that is ready for user input
  dispatch(actionCreators.resizeApp(window.innerWidth, window.innerHeight));
  dispatch(actionCreators.releaseMouse());

  // Register UI events
  const keymap = makeKeymap(dispatch, actionCreators);
  registerCommonEvents(dispatch, actionCreators, keymap);
};
