import React from 'react';
import ReactDOM from 'react-dom';
import config from './config.json';
import EditApp from './components/EditApp.jsx';

const appRoot = document.createElement('div');
document.body.appendChild(appRoot);
ReactDOM.render(<EditApp config={config} />, appRoot);
