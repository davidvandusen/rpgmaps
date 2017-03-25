const config = require('./config.json');

import InputMap from './InputMap';

const inputMap = new InputMap(config);

function countPixelColors(imageData) {
  let colors = {};
  for (let i = 0; i < imageData.length; i += 4) {
    const color = `rgba(${imageData[i]},${imageData[i + 1]},${imageData[i + 2]},${imageData[i + 3]})`;
    if (!colors[color]) {
      colors[color] = 0;
    }
    colors[color]++;
  }
  return colors;
}

function detectAreas(imageData) {
  let areas = [];
  return areas;
}

inputMap.onUpdate = function (imageData) {
  console.log('map updated');
  let colors = countPixelColors(imageData);
  console.log(colors);
  let areas = detectAreas(imageData);
  console.log(areas);
};
