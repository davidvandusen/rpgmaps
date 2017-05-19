const React = require('react');
const {render} = require('react-dom');
const {createStore, applyMiddleware, compose} = require('redux');
const thunk = require('redux-thunk').default;
const {Provider} = require('react-redux');
const persistence = require('./common/persistence');
const rootReducer = require('./reducers/rootReducer');
const defaultState = require('./edit-defaultState');
const initialize = require('./config/edit-initialize');
const EditApp = require('./components/EditApp.jsx');
const actionCreators = require('./actions/actionCreators');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, {
  ...defaultState,
  ...persistence.load('editApp')
}, composeEnhancers(applyMiddleware(thunk)));

initialize(store.dispatch, actionCreators);

render((
  <Provider store={store}>
    <EditApp />
  </Provider>
), document.getElementById('react-root'));
