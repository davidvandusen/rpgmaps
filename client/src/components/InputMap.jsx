const React = require('react');
const InputImage = require('./InputImage.jsx');
const InputPaint = require('./InputPaint.jsx');
const InputBrush = require('./InputBrush.jsx');

const InputMap = () => (
  <div className="input-map">
    <InputImage />
    <InputPaint />
    <InputBrush />
  </div>
);

module.exports = InputMap;
