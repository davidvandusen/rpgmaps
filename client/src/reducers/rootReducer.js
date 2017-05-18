const reduceReducers = require('./reduceReducers');
const {combineReducers} = require('redux');
const mouse = require('./mouseReducer');
const settings = require('./settingsReducer');
const workspace = require('./workspaceReducer');
const tools = require('./toolsReducer');

module.exports = reduceReducers(
  combineReducers({
    graphics: (state = {}) => state,
    mouse,
    settings,
    workspace
  }),
  tools
);
