const React = require('react');
const {render} = require('react-dom');
const {createStore, applyMiddleware, compose} = require('redux');
const thunk = require('redux-thunk').default;
const {Provider} = require('react-redux');
const persistence = require('./common/persistence');
const editAppReducers = require('./reducers/editApp');
const defaultState = require('./edit-defaults');
const EditApp = require('./components/EditApp.jsx');
const actions = require('./actions/editApp');
const {throttle} = require('lodash');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [];

middlewares.push(thunk);

const store = createStore(
  editAppReducers,
  {...defaultState, ...persistence.load('editApp')},
  composeEnhancers(applyMiddleware(...middlewares))
);

store.dispatch(actions.resizeApp(window.innerWidth, window.innerHeight));
store.dispatch(actions.paintInput([]));
store.dispatch(actions.scaleToFit());
store.dispatch(actions.centerSurface());

window.addEventListener('resize', throttle(() => store.dispatch(actions.resizeApp(window.innerWidth, window.innerHeight)), 100));
window.addEventListener('wheel', throttle(event => store.dispatch(actions.scaleSurface(event.deltaY / 100, event.clientX, event.clientY)), 16), {passive: true});
document.addEventListener('mousemove', throttle(event => store.dispatch(actions.moveMouse(event.clientX, event.clientY)), 16));
document.addEventListener('mousedown', () => store.dispatch(actions.depressMouse()));
document.addEventListener('mouseup', () => store.dispatch(actions.releaseMouse()));
document.addEventListener('keydown', event => {
  switch (event.key) {
    case ' ':
      store.dispatch(actions.setTool('DRAG'));
      break;
    case '\'':
      store.dispatch(actions.cycleTerrain());
      break;
    case ';':
      store.dispatch(actions.cycleTerrainReverse());
      break;
    case ']':
      store.dispatch(actions.incrementBrushSize());
      break;
    case '[':
      store.dispatch(actions.decrementBrushSize());
      break;
    case 'c':
      store.dispatch(actions.centerSurface());
      break;
    case 'z':
      store.dispatch(actions.scaleToFit());
      store.dispatch(actions.centerSurface());
      break;
  }
});
document.addEventListener('keyup', event => {
  switch (event.key) {
    case ' ':
      store.dispatch(actions.setTool('BRUSH'));
      break;
  }
});

render((
  <Provider store={store}>
    <EditApp />
  </Provider>
), document.getElementById('react-root'));
