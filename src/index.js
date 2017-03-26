import config from './config.json';
import InputMap from './InputMap';
import {countPixelColors, detectAreas} from './imageDataCommon';
import base64 from 'base64-js';

const inputMap = new InputMap(config);

inputMap.onUpdate = function (imageData) {
  console.log('map updated');
  let colors = countPixelColors(imageData);
  console.log(colors);
  if (Object.keys(colors).length > 1) {
    detectAreas(imageData).then(areas => {
      areas.forEach(area => {
        console.log(base64.fromByteArray(area));
      });
    });
  }
};

inputMap.init();
