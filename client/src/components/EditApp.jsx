require('../../styles/edit-app.scss');
const React = require('react');
const OutputMap = require('./OutputMap.jsx');
const InputMap = require('./InputMap.jsx');

const EditApp = () => (
  <div className="edit-app">
    <OutputMap />
    <InputMap />
  </div>
);

module.exports = EditApp;
