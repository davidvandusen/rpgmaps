const {cssToRgba} = require('../common/color');

const editApp = (state, action) => {
  switch (action.type) {
    case 'SET_MAP_DATA':
      return {...state, mapData: action.payload.mapData};
    case 'SET_TOOL':
      return {...state, tool: action.payload.tool};
    case 'DEPRESS_MOUSE':
      return {
        ...state,
        mouse: {...state.mouse, isDown: true, isUp: false}
      };
    case 'RELEASE_MOUSE':
      return {
        ...state,
        mouse: {...state.mouse, isDown: false, isUp: true}
      };
    case 'DECREMENT_BRUSH_SIZE':
      return {...state, brush: {...state.brush, size: Math.max(1, state.brush.size - 1)}};
    case 'INCREMENT_BRUSH_SIZE':
      return {...state, brush: {...state.brush, size: state.brush.size + 1}};
    case 'MOVE_MOUSE':
      let surface = state.surface;
      if (state.mouse.isDown && state.tool === 'DRAG') {
        surface = {...state.surface};
        const dx = state.mouse.x - action.payload.x;
        const dy = state.mouse.y - action.payload.y;
        surface.x -= dx;
        surface.y -= dy;
      }
      const mouse = {...state.mouse, ...action.payload};
      return {...state, surface, mouse};
    case 'RESIZE_APP':
      return {...state, ...action.payload};
    case 'CENTER_SURFACE':
      return {...state, surface: {
        ...state.surface,
        x: state.width / 2 - state.surface.width * state.surface.scale / 2,
        y: state.height / 2 - state.surface.height * state.surface.scale / 2
      }};
    case 'SCALE_SURFACE':
      // TODO keep cursor in same spot on canvas while zooming
      const scale = Math.max(1, state.surface.scale + action.payload.delta);
      const delta = scale - state.surface.scale;
      const px = (action.payload.x - state.surface.x) / (state.width * scale);
      const py = (action.payload.y - state.surface.y) / (state.height * scale);
      const dx = delta * state.width * px;
      const dy = delta * state.height * py;
      const x = state.surface.x - dx;
      const y = state.surface.y - dy;
      return {
        ...state,
        surface: {
          ...state.surface,
          scale,
          x,
          y
        }
      };
    case 'PAINT_INPUT':
      if (action.payload.indices.length === 0) return state;
      const dataArray = new Uint8ClampedArray(state.surface.width * state.surface.height * 4);
      if (state.inputImageData) {
        dataArray.set(state.inputImageData.data);
      }
      const color = cssToRgba(state.terrains[state.terrain].color);
      for (const index of action.payload.indices) {
        dataArray[index * 4] = color[0];
        dataArray[index * 4 + 1] = color[1];
        dataArray[index * 4 + 2] = color[2];
        dataArray[index * 4 + 3] = 0xff;
      }
      const inputImageData = new ImageData(dataArray, state.surface.width, state.surface.height);
      return {...state, inputImageData};
    default:
      return state;
  }
};

module.exports = editApp;
