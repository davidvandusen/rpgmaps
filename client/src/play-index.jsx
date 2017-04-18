const React = require('react');
const ReactDOM = require('react-dom');
const config = require('./config.json');
const PlayApp = require('./components/PlayApp.jsx');

const appRoot = document.createElement('div');
document.body.appendChild(appRoot);
ReactDOM.render(<PlayApp config={config} />, appRoot);
