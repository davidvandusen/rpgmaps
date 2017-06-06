const {setInputBuffer, processInput} = require('./graphicsActions');
const mapDataFactory = require('../common/mapDataFactory');

exports.exportMap = () => (dispatch, getState) => {
  const mapData = {...getState().data.mapData, version: APP_VERSION};
  const uri = 'data:application/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(mapData));
  const link = document.createElement('a');
  link.download = Date.now();
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

exports.importMap = () => (dispatch, getState) => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.style.display = 'none';
  fileInput.addEventListener('change', event => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const mapData = mapDataFactory.hydrateJSON(JSON.parse(reader.result));
        dispatch(setInputBuffer(mapDataFactory(getState().settings.input.terrains).toImageData(mapData)));
        dispatch(processInput());
      } catch (err) {
        console.error(err.message);
      }
    };
    reader.readAsText(event.target.files[0]);
  });
  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
};

