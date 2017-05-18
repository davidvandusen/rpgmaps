const React = require('react');
const {render} = require('react-dom');
const {createStore, applyMiddleware, compose} = require('redux');
const thunk = require('redux-thunk').default;
const {Provider} = require('react-redux');
const persistence = require('./common/persistence');
const rootReducer = require('./reducers/rootReducer');
const defaultState = require('./edit-defaults');
const EditApp = require('./components/EditApp.jsx');
const actionsCreators = require('./actions/actionCreators');
const {throttle} = require('lodash');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [];

middlewares.push(thunk);

const store = createStore(
  rootReducer,
  {...defaultState, ...persistence.load('editApp')},
  composeEnhancers(applyMiddleware(...middlewares))
);

store.dispatch(actionsCreators.resizeApp(window.innerWidth, window.innerHeight));
store.dispatch(actionsCreators.scaleToFit());
store.dispatch(actionsCreators.centerSurface());

const keymap = {};

keymap.down = {
  ' ': () => store.dispatch(actionsCreators.setTool('DRAG')),
  "'": () => store.dispatch(actionsCreators.cycleTerrain()),
  ';': () => store.dispatch(actionsCreators.cycleTerrainReverse()),
  ']': () => store.dispatch(actionsCreators.incrementBrushSize()),
  '[': () => store.dispatch(actionsCreators.decrementBrushSize()),
  'c': () => store.dispatch(actionsCreators.centerSurface()),
  'z': () => {
    store.dispatch(actionsCreators.scaleToFit());
    store.dispatch(actionsCreators.centerSurface());
  }
};

keymap.up = {
  ' ': () => store.dispatch(actionsCreators.setTool('BRUSH'))
};

window.addEventListener('resize', throttle(() => store.dispatch(actionsCreators.resizeApp(window.innerWidth, window.innerHeight)), 100), {passive: true});
document.addEventListener('wheel', throttle(event => store.dispatch(actionsCreators.scaleSurface(event.deltaY / 100, event.clientX, event.clientY)), 16), {passive: true});
document.addEventListener('mousemove', throttle(event => store.dispatch(actionsCreators.moveMouse(event.clientX, event.clientY)), 16), {passive: true});
document.addEventListener('mousedown', () => store.dispatch(actionsCreators.depressMouse()));
document.addEventListener('mouseup', () => store.dispatch(actionsCreators.releaseMouse()));
document.addEventListener('keydown', event => {
  const fn = keymap.down[event.key];
  if (typeof fn === 'function') fn(event);
});
document.addEventListener('keyup', event => {
  const fn = keymap.up[event.key];
  if (typeof fn === 'function') fn(event);
});

render((
  <Provider store={store}>
    <EditApp />
  </Provider>
), document.getElementById('react-root'));
