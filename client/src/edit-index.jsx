const React = require('react');
const {render} = require('react-dom');
const {createStore} = require('redux');
const {Provider} = require('react-redux');
const persistence = require('./common/persistence');
const editAppReducers = require('./reducers/editApp');
const defaultState = require('./edit-defaults');
const EditApp = require('./components/EditApp.jsx');
const {bindGlobalEvents} = require('./actions/editApp');

const store = createStore(editAppReducers, {...defaultState, ...persistence.load('editApp')});

bindGlobalEvents(store);

render((
  <Provider store={store}>
    <EditApp />
  </Provider>
), document.getElementById('react-root'));
