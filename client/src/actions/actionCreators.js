const makeActionCreator = require('./makeActionCreator');

// Mouse actions
exports.depressMouse = makeActionCreator('DEPRESS_MOUSE');
exports.releaseMouse = makeActionCreator('RELEASE_MOUSE');
exports.moveMouse = makeActionCreator('MOVE_MOUSE', 'x', 'y');

// Settings actions
exports.incrementBrushSize = makeActionCreator('INCREMENT_BRUSH_SIZE');
exports.decrementBrushSize = makeActionCreator('DECREMENT_BRUSH_SIZE');
exports.setTool = makeActionCreator('SET_TOOL', 'tool');
exports.cycleTerrain = makeActionCreator('CYCLE_TERRAIN');
exports.cycleTerrainReverse = makeActionCreator('CYCLE_TERRAIN_REVERSE');

// Workspace actions
exports.resizeApp = makeActionCreator('RESIZE_APP', 'width', 'height');
exports.centerSurface = makeActionCreator('CENTER_SURFACE');
exports.scaleToFit = makeActionCreator('SCALE_TO_FIT');
exports.scaleSurface = makeActionCreator('SCALE_SURFACE', 'delta', 'x', 'y');
