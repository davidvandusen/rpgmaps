import React from 'react';
import ReactDOM from 'react-dom';
import config from './config.json';
import PlayApp from './components/PlayApp.jsx';

const appRoot = document.createElement('div');
document.body.appendChild(appRoot);
ReactDOM.render(<PlayApp config={config} />, appRoot);
