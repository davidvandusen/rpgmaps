const makeKeymap = require('./edit-keymap');
const registerCommonEvents = require('./common-events');

module.exports = (dispatch, actionCreators) => {
  // Perform an initial set of actions to bring the initial state to one that is ready for user input
  dispatch(actionCreators.resizeApp(window.innerWidth, window.innerHeight));
  dispatch(actionCreators.scaleToFit());
  dispatch(actionCreators.centerSurface());
  dispatch(actionCreators.releaseMouse());

  // Register UI events
  const keymap = makeKeymap(dispatch, actionCreators);
  registerCommonEvents(dispatch, actionCreators, keymap);
};
