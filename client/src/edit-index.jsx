const React = require('react');
const {render} = require('react-dom');
const {createStore, applyMiddleware, compose} = require('redux');
const thunk = require('redux-thunk').default;
const {Provider} = require('react-redux');
const rootReducer = require('./reducers/rootReducer');
const initialize = require('./config/edit-initialize');
const EditApp = require('./components/EditApp.jsx');

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

initialize(store);

render((
  <Provider store={store}>
    <EditApp />
  </Provider>
), document.getElementById('react-root'));
