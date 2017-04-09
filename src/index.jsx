import React from 'react';
import ReactDOM from 'react-dom';
import config from './config.json';
import App from './components/App.jsx';

const appRoot = document.createElement('div');
document.body.appendChild(appRoot);
ReactDOM.render(<App config={config} />, appRoot);
