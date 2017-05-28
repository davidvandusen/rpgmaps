const makeActionCreator = require('./makeActionCreator');

const setGridLineColor = makeActionCreator('SET_GRID_LINE_COLOR', 'lineColor');
exports.setGridLineColor = setGridLineColor;

const setGridLineWidth = makeActionCreator('SET_GRID_LINE_WIDTH', 'lineWidth');
exports.setGridLineWidth = setGridLineWidth;

const setGridOpacity = makeActionCreator('SET_GRID_OPACITY', 'opacity');
exports.setGridOpacity = setGridOpacity;

const setGridSpacing = makeActionCreator('SET_GRID_SPACING', 'spacing');
exports.setGridSpacing = setGridSpacing;

const setGridType = makeActionCreator('SET_GRID_TYPE', 'type');
exports.setGridType = setGridType;
