const makeActionCreator = require('./makeActionCreator');

const setMapData = makeActionCreator('SET_MAP_DATA', 'mapData');
exports.setMapData = setMapData;
