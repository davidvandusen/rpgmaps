const createReducer = require('./createReducer');
const terrains = require('../config/terrains');

const defaultForeground = terrains.findIndex(t => t.className === 'CloseUpPath');
const defaultBackground = terrains.findIndex(t => t.className === 'CloseUpGrass');

module.exports = createReducer({
  defaultBackground,
  defaultForeground,
  background: defaultBackground,
  foreground: defaultForeground,
  terrains,
  tool: 'NONE',
  brushSize: 5,
  width: 128,
  height: 72
}, {
  SET_TERRAINS: (state, {payload}) => ({
    ...state,
    terrains: payload.terrains
  }),
  SET_DEFAULT_BACKGROUND: (state, {payload}) => ({
    ...state,
    defaultBackground: Math.max(0, Math.min(state.terrains.length, Math.floor(payload.defaultBackground)))
  }),
  SET_DEFAULT_FOREGROUND: (state, {payload}) => ({
    ...state,
    defaultForeground: Math.max(0, Math.min(state.terrains.length, Math.floor(payload.defaultForeground)))
  }),
  SET_BACKGROUND: (state, {payload}) => ({
    ...state,
    background: Math.max(0, Math.min(state.terrains.length, Math.floor(payload.background)))
  }),
  SET_FOREGROUND: (state, {payload}) => ({
    ...state,
    foreground: Math.max(0, Math.min(state.terrains.length, Math.floor(payload.foreground)))
  }),
  SET_TOOL: (state, {payload}) => ({
    ...state,
    tool: payload.tool
  }),
  SET_BRUSH_SIZE: (state, {payload}) => ({
    ...state,
    brushSize: Math.max(1, Math.min(128, Math.floor(payload.brushSize)))
  })
});
