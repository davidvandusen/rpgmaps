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
store.dispatch(actionsCreators.paintInput([]));
store.dispatch(actionsCreators.scaleToFit());
store.dispatch(actionsCreators.centerSurface());

window.addEventListener('resize', throttle(() => store.dispatch(actionsCreators.resizeApp(window.innerWidth, window.innerHeight)), 100), {passive: true});
window.addEventListener('wheel', throttle(event => store.dispatch(actionsCreators.scaleSurface(event.deltaY / 100, event.clientX, event.clientY)), 16), {passive: true});
document.addEventListener('mousemove', throttle(event => store.dispatch(actionsCreators.moveMouse(event.clientX, event.clientY)), 16), {passive: true});
document.addEventListener('mousedown', () => store.dispatch(actionsCreators.depressMouse()));
document.addEventListener('mouseup', () => store.dispatch(actionsCreators.releaseMouse()));
document.addEventListener('keydown', event => {
  switch (event.key) {
    case ' ':
      store.dispatch(actionsCreators.setTool('DRAG'));
      break;
    case '\'':
      store.dispatch(actionsCreators.cycleTerrain());
      break;
    case ';':
      store.dispatch(actionsCreators.cycleTerrainReverse());
      break;
    case ']':
      store.dispatch(actionsCreators.incrementBrushSize());
      break;
    case '[':
      store.dispatch(actionsCreators.decrementBrushSize());
      break;
    case 'c':
      store.dispatch(actionsCreators.centerSurface());
      break;
    case 'z':
      store.dispatch(actionsCreators.scaleToFit());
      store.dispatch(actionsCreators.centerSurface());
      break;
  }
});
document.addEventListener('keyup', event => {
  switch (event.key) {
    case ' ':
      store.dispatch(actionsCreators.setTool('BRUSH'));
      break;
  }
});

render((
  <Provider store={store}>
    <EditApp />
  </Provider>
), document.getElementById('react-root'));
