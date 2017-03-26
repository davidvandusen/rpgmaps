const config = require('./config.json');
import InputMap from './InputMap';
import {countPixelColors, detectAreas} from './imageDataCommon';

const inputMap = new InputMap(config);

inputMap.onUpdate = function (imageData) {
  console.log('map updated');
  let colors = countPixelColors(imageData);
  console.log(colors);
  detectAreas(imageData).then(areas => {
    areas.forEach((area, i) => {
      console.log('Area:', i + 1);
      let f = '';
      for (let i = 0; i < area.length / imageData.width; i++) {
        let l = '';
        for (let j = 0; j < imageData.width; j++) {
          l += area[j + i * imageData.width] ? 'O' : '.';
        }
        f += l + '\n';
      }
      console.log(f);
    });
  });
};

inputMap.init();
