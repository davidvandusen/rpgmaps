const createReducer = require('./createReducer');
const reduceReducers = require('./reduceReducers');
const {combineReducers} = require('redux');
const {cssToRgba} = require('../common/color');

const editApp = (state, action) => {
  switch (action.type) {
    case 'PAINT_INPUT':
      if (action.payload.indices.length === 0) return state;
      const dataArray = new Uint8ClampedArray(state.surface.width * state.surface.height * 4);
      if (state.inputBuffer) {
        dataArray.set(state.inputBuffer.data);
      }
      const color = cssToRgba(state.terrains[state.terrain].color);
      for (const index of action.payload.indices) {
        dataArray[index * 4] = color[0];
        dataArray[index * 4 + 1] = color[1];
        dataArray[index * 4 + 2] = color[2];
        dataArray[index * 4 + 3] = 0xff;
      }
      const inputBuffer = new ImageData(dataArray, state.surface.width, state.surface.height);
      return {...state, inputBuffer};
    default:
      return state;
  }
};

const graphics = (state = {}, action) => state;
const mouse = createReducer({}, {
  'MOVE_MOUSE': (state, action) => {
    const dx = state.x - action.payload.x;
    const dy = state.y - action.payload.y;
    return ({...state, ...action.payload, dx, dy});
  },
  'DEPRESS_MOUSE': state => ({...state, isDown: true, isUp: false}),
  'RELEASE_MOUSE': state => ({...state, isDown: false, isUp: true}),
});
const settings = createReducer({}, {
  'CYCLE_TERRAIN': state => ({...state, terrain: state.terrain === state.terrains.length - 1 ? 0 : state.terrain + 1}),
  'CYCLE_TERRAIN_REVERSE': state => ({
    ...state,
    terrain: state.terrain === 0 ? state.terrains.length - 1 : state.terrain - 1
  }),
  'SET_TOOL': (state, action) => ({...state, tool: action.payload.tool}),
  'DECREMENT_BRUSH_SIZE': state => ({...state, brush: {...state.brush, size: Math.max(1, state.brush.size - 1)}}),
  'INCREMENT_BRUSH_SIZE': state => ({...state, brush: {...state.brush, size: state.brush.size + 1}})
});
const workspace = createReducer({}, {
  'RESIZE_APP': (state, action) => ({...state, ...action.payload}),
  'CENTER_SURFACE': state => ({
    ...state,
    x: state.width / 2 - state.surface.width * state.scale / 2,
    y: state.height / 2 - state.surface.height * state.scale / 2
  }),
  'SCALE_TO_FIT': state => {
    const xRatio = state.width / state.surface.width;
    const yRatio = state.height / state.surface.height;
    const scale = xRatio < yRatio ? xRatio : yRatio;
    return {...state, scale};
  },
  'SCALE_SURFACE': (state, action) => {
    // TODO improve keeping cursor in same spot on canvas while zooming
    const scale = Math.max(1, state.scale + action.payload.delta);
    const delta = scale - state.scale;
    const px = (action.payload.x - state.x) / (state.width * scale);
    const py = (action.payload.y - state.y) / (state.height * scale);
    const dx = delta * state.width * px;
    const dy = delta * state.height * py;
    const x = state.x - dx;
    const y = state.y - dy;
    return {
      ...state,
      scale,
      x,
      y
    };
  }
});
const crossCutting = createReducer({}, {
  'MOVE_MOUSE': state => {
    if (state.mouse.isDown && state.settings.tool === 'DRAG') {
      return {
        ...state,
        workspace: {
          ...state.workspace,
          x: state.workspace.x - state.mouse.dx,
          y: state.workspace.y - state.mouse.dy
        }
      };
    }
    return state;
  }
});

module.exports = reduceReducers(
  combineReducers({
    graphics,
    mouse,
    settings,
    workspace
  }),
  crossCutting
);
