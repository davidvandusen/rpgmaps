const {combineReducers} = require('redux');
const grid = require('./gridReducer');
const input = require('./inputReducer');
const output = require('./outputReducer');
const tokens = require('./tokensReducer');

module.exports = combineReducers({
  grid,
  input,
  output,
  tokens
});
