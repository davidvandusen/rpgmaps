const terrains = require('./terrains');

const defaultForeground = terrains.findIndex(t => t.className === 'CloseUpPath');
const defaultBackground = terrains.findIndex(t => t.className === 'CloseUpGrass');

module.exports = {
  settings: {
    input: {
      defaultBackground,
      defaultForeground,
      background: defaultBackground,
      foreground: defaultForeground,
      terrains
    }
  }
};
