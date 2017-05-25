const React = require('react');
const {render} = require('react-dom');
const {createStore, applyMiddleware} = require('redux');
const thunk = require('redux-thunk').default;
const {Provider} = require('react-redux');
const rootReducer = require('./reducers/rootReducer');
const initialize = require('./config/edit-initialize');
const EditApp = require('./components/EditApp.jsx');

const store = createStore(rootReducer, applyMiddleware(thunk));

initialize(store);

render((
  <Provider store={store}>
    <EditApp />
  </Provider>
), document.getElementById('react-root'));
