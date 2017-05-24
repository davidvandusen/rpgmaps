const {combineReducers} = require('redux');
const data = require('./dataReducer');
const settings = require('./settingsReducer');
const ui = require('./uiReducer');

module.exports = combineReducers({
  data,
  settings,
  ui
});
