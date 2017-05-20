const React = require('react');
const {connect} = require('react-redux');
const CanvasImage = require('./CanvasImage.jsx');

const mapStateToProps = state => ({
  buffer: state.graphics.crossfadeBuffer,
  className: 'crossfade-image',
  height: state.workspace.height,
  imageSmoothingEnabled: true,
  opacity: state.graphics.crossfadeOpacity,
  outputQuality: state.settings.outputQuality,
  scale: state.workspace.scale,
  surfaceHeight: state.workspace.surface.height,
  surfaceWidth: state.workspace.surface.width,
  width: state.workspace.width,
  x: state.workspace.x,
  y: state.workspace.y
});

module.exports = connect(mapStateToProps)(CanvasImage);
