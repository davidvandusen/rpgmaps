const React = require('react');
const OutputImage = require('./OutputImage.jsx');
const OutputGrid = require('./OutputGrid.jsx');
const OutputFrame = require('./OutputFrame.jsx');

const OutputMap = () => (
  <div className="output-map">
    <OutputImage />
    <OutputGrid />
    <OutputFrame />
  </div>
);

module.exports = OutputMap;
