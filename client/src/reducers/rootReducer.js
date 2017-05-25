const {combineReducers} = require('redux');
const persistent = require('./persistent');
const dataReducer = require('./dataReducer');
const settingsReducer = require('./settingsReducer');
const uiReducer = require('./uiReducer');
const mapDataFactory = require('../common/mapDataFactory');

module.exports = combineReducers({
  data: persistent(dataReducer, {
    key: 'edit.data',
    deserialize: str => {
      const obj = JSON.parse(str);
      obj.mapData = mapDataFactory.hydrateJSON(obj.mapData);
      return obj;
    }
  }),
  settings: persistent(settingsReducer, {key: 'edit.settings'}),
  // UI is transient, unlike settings and data
  ui: uiReducer
});
