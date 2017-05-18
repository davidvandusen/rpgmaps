require('../../styles/edit-app.scss');
const React = require('react');
const InputImage = require('./InputImage.jsx');
const InputPaint = require('./InputPaint.jsx');
const InputTool = require('./InputTool.jsx');
const OutputImage = require('./OutputImage.jsx');
const OutputGrid = require('./OutputGrid.jsx');

const EditApp = () => (
  <div className="edit-app">
    <div className="workspace">
      <OutputImage />
      <OutputGrid />
      <InputImage />
      <InputPaint />
      <InputTool />
    </div>
  </div>
);

module.exports = EditApp;
