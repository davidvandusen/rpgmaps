const React = require('react');
const InputImage = require('./InputImage.jsx');
const InputPaint = require('./InputPaint.jsx');
const InputTool = require('./InputTool.jsx');

const InputMap = () => (
  <div className="input-map">
    <InputImage />
    <InputPaint />
    <InputTool />
  </div>
);

module.exports = InputMap;
