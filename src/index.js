import '../styles/main.scss';
import config from './config.json';
import InputMap from './InputMap';
import OutputMap from './OutputMap';

const inputMapDiv = document.getElementById('input-map');
const inputMap = new InputMap(inputMapDiv, config);

const outputMapDiv = document.getElementById('output-map');
const outputMap = new OutputMap(outputMapDiv, config, inputMap);

inputMap.onUpdate = outputMap.setInput.bind(outputMap);

inputMap.init();
outputMap.init();
