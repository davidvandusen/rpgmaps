const makeKeymap = require('./edit-keymap');
const registerCommonEvents = require('./common-events');
const terrains = require('./terrains');
const mapDataFactory = require('../common/mapDataFactory');
const {setMapData} = require('../actions/dataActions');
const {resetInputBuffer, setInputBuffer, resetPaintBuffer, setOutputOpacity, setCrossfadeOpacity, setInputOpacity, setPaintOpacity, processInput} = require('../actions/graphicsActions');
const {setTerrains, setDefaultForeground, setDefaultBackground, setForeground, setBackground} = require('../actions/inputActions');

module.exports = ({dispatch, getState}) => {
  const state = getState();

  const roomName = location.pathname.substring(1, location.pathname.indexOf('/', 1));
  document.title = `Edit ${roomName} - RPG Maps`;

  // HACK Checking for initial load with no persisted settings
  if (state.settings.input.terrains.length === 0) {
    dispatch(setTerrains(terrains));
    const defaultForeground = terrains.findIndex(t => t.className === 'CloseUpPath');
    const defaultBackground = terrains.findIndex(t => t.className === 'CloseUpGrass');
    dispatch(setDefaultForeground(defaultForeground));
    dispatch(setDefaultBackground(defaultBackground));
    dispatch(setForeground(defaultForeground));
    dispatch(setBackground(defaultBackground));
  }

  dispatch(setOutputOpacity(1));
  dispatch(setCrossfadeOpacity(0));
  dispatch(setInputOpacity(0));
  dispatch(setPaintOpacity(0.75));

  dispatch(resetPaintBuffer());

  const mapData = state.data.mapData;
  if (mapData) {
    // HACK Set mapData to undefined so that image processing thinks the image changed
    dispatch(setMapData());
    const imageData = mapDataFactory(terrains).toImageData(mapData);
    dispatch(setInputBuffer(imageData));
  } else {
    dispatch(resetInputBuffer());
  }
  dispatch(processInput());

  // Register UI events
  const keymap = makeKeymap(dispatch);
  registerCommonEvents(dispatch, keymap);
};
