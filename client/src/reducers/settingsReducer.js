const {combineReducers} = require('redux');
const grid = require('./gridReducer');
const input = require('./inputReducer');
const output = require('./outputReducer');

module.exports = combineReducers({
  grid,
  input,
  output
});
