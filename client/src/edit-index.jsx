const React = require('react');
const {render} = require('react-dom');
const {createStore, applyMiddleware} = require('redux');
const thunk = require('redux-thunk').default;
const {Provider} = require('react-redux');
const persistence = require('./common/persistence');
const editAppReducers = require('./reducers/editApp');
const defaultState = require('./edit-defaults');
const EditApp = require('./components/EditApp.jsx');
const {bindGlobalEvents} = require('./actions/editApp');

const store = createStore(
  editAppReducers,
  {...defaultState, ...persistence.load('editApp')},
  applyMiddleware(thunk)
);

bindGlobalEvents(store);

render((
  <Provider store={store}>
    <EditApp />
  </Provider>
), document.getElementById('react-root'));
