const {combineReducers} = require('redux');
const graphics = require('./graphicsReducer');
const mouse = require('./mouseReducer');
const settings = require('./settingsReducer');
const workspace = require('./workspaceReducer');

module.exports = combineReducers({
  graphics,
  mouse,
  settings,
  workspace
});
