const React = require('react');
const ReactDOM = require('react-dom');
const config = require('./config.json');
const EditApp = require('./components/EditApp.jsx');

const appRoot = document.createElement('div');
document.body.appendChild(appRoot);
ReactDOM.render(<EditApp config={config} />, appRoot);
