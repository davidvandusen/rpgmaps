const React = require('react');
const {render} = require('react-dom');
const {createStore, applyMiddleware} = require('redux');
const thunk = require('redux-thunk').default;
const {Provider} = require('react-redux');
const rootReducer = require('./reducers/rootReducer');
const initialize = require('./config/play-initialize');
const PlayApp = require('./components/PlayApp.jsx');

const store = createStore(rootReducer, applyMiddleware(thunk));

initialize(store);

render((
  <Provider store={store}>
    <PlayApp />
  </Provider>
), document.getElementById('react-root'));
