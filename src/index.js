import '../styles/main.scss';
import config from './config.json';
import InputMap from './InputMap';
import OutputMap from './OutputMap';

const inputMapDiv = document.getElementById('input-map');
const inputMap = new InputMap(inputMapDiv, config);

const outputMapDiv = document.getElementById('output-map');
const outputMap = new OutputMap(outputMapDiv, config, inputMap);

const processingIndicator = document.getElementById('processing');

outputMap.onStatusChanged = function (status) {
  if (status === OutputMap.PROCESSING) {
    processingIndicator.innerHTML = '<span class="dot"></span> Processing...';
  }
  if (status === OutputMap.READY) {
    processingIndicator.innerHTML = '&nbsp;';
  }
};

inputMap.onUpdate = outputMap.setInput.bind(outputMap);

inputMap.init();
outputMap.init();
