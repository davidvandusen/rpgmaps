const {combineReducers} = require('redux');
const controls = require('./controlsReducer');
const graphics = require('./graphicsReducer');
const mouse = require('./mouseReducer');
const workspace = require('./workspaceReducer');

module.exports = combineReducers({
  controls,
  graphics,
  mouse,
  workspace
});
