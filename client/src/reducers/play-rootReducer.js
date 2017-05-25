const {combineReducers} = require('redux');
const persistent = require('./persistent');
const dataReducer = require('./dataReducer');
const settingsReducer = require('./settingsReducer');
const uiReducer = require('./uiReducer');

module.exports = combineReducers({
  data: dataReducer,
  settings: persistent(settingsReducer, {key: 'play.settings'}),
  ui: uiReducer
});
