const makeActionCreator = require('./makeActionCreator');

const setMapData = makeActionCreator('SET_MAP_DATA', 'mapData');
exports.setMapData = setMapData;

const setPublishedMap = makeActionCreator('SET_PUBLISHED_MAP', 'publishedMap');
exports.publishMap = () => (dispatch, getState) => {
  dispatch(setPublishedMap(getState().data.mapData));
};
