const React = require('react');
const {render} = require('react-dom');
const {createStore, applyMiddleware} = require('redux');
const thunk = require('redux-thunk').default;
const {Provider} = require('react-redux');
const rootReducer = require('./reducers/edit-rootReducer');
const initialize = require('./config/edit-initialize');
const EditApp = require('./components/EditApp.jsx');

const logger = store => next => action => {
  if (['MOVE_MOUSE', 'SET_CROSSFADE_OPACITY'].includes(action.type)) return next(action);
  console.group(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  console.groupEnd(action.type);
  return result;
};

const store = createStore(rootReducer, applyMiddleware(thunk));

initialize(store);

render((
  <Provider store={store}>
    <EditApp />
  </Provider>
), document.getElementById('react-root'));
