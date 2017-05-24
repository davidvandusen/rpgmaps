const makeKeymap = require('./edit-keymap');
const registerCommonEvents = require('./common-events');
const {resetInputBuffer, resetPaintBuffer, setOutputOpacity, setCrossfadeOpacity, setInputOpacity, setPaintOpacity} = require('../actions/graphicsActions');
const terrains = require('./terrains');
const {setTerrains, setDefaultForeground, setDefaultBackground, setForeground, setBackground} = require('../actions/inputActions');

module.exports = ({dispatch}) => {
  const roomName = location.pathname.substring(1, location.pathname.indexOf('/', 1));
  document.title = `Edit ${roomName} - RPG Maps`;

  // Perform an initial set of actions to bring the initial UI state to one that is ready for user input
  dispatch(setOutputOpacity(1));
  dispatch(setCrossfadeOpacity(0));
  dispatch(setInputOpacity(0));
  dispatch(setPaintOpacity(0.75));

  // TODO eventually this should be gotten from persistence; how is it set initially?
  dispatch(setTerrains(terrains));
  const defaultForeground = terrains.findIndex(t => t.className === 'CloseUpPath');
  const defaultBackground = terrains.findIndex(t => t.className === 'CloseUpGrass');
  dispatch(setDefaultForeground(defaultForeground));
  dispatch(setDefaultBackground(defaultBackground));
  dispatch(setForeground(defaultForeground));
  dispatch(setBackground(defaultBackground));

  dispatch(resetPaintBuffer());
  dispatch(resetInputBuffer());

  // Register UI events
  const keymap = makeKeymap(dispatch);
  registerCommonEvents(dispatch, keymap);
};
