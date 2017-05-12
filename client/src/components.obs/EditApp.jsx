require('../../styles.obs/edit-app.scss');
const React = require('react');
const EditControls = require('./EditControls.jsx');
const InputMap = require('./InputMap.jsx');
const Bento = require('./Bento.jsx');
const OutputMap = require('./OutputMap.jsx');
const mapDataFactory = require('../common/mapDataFactory');
const persistence = require('../common/persistence');

class EditApp extends React.Component {
  constructor(props) {
    super(props);
    this.mapDataFactory = mapDataFactory(this.props.config.terrains);
    this.roomName = location.pathname.substring(1, location.pathname.indexOf('/', 1));
    const storedMapData = persistence.load('mapData');
    const mapData = storedMapData && mapDataFactory.hydrateJSON(storedMapData);
    const imageData = mapData && this.mapDataFactory.toImageData(mapData);
    this.state = Object.assign({
      brushSize: this.props.config.input.brush.size.default,
      imageData: imageData,
      mapData: undefined,
      mode: this.props.config.ui.mode.default,
      status: 'init',
      terrain: this.props.config.terrains.findIndex(t => t.className === this.props.config.input.defaultForeground),
      title: `Edit ${this.roomName} - RPG Maps`
    }, persistence.load('persistentEditAppSettings'));
    this.keymap = {
      // [
      38: () => this.setTerrain(this.state.terrain - 1),
      // ]
      40: () => this.setTerrain(this.state.terrain + 1),
      // UP
      219: () => this.setBrushSize(this.state.brushSize - 1),
      // DOWN
      221: () => this.setBrushSize(this.state.brushSize + 1)
    };
    this.updateImageData = this.updateImageData.bind(this);
    this.publishMap = this.publishMap.bind(this);
    this.setTerrain = this.setTerrain.bind(this);
    this.setBrushSize = this.setBrushSize.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.reset = this.reset.bind(this);
    this.changeMode = this.changeMode.bind(this);
    this.processImageData = this.processImageData.bind(this);
    this.mapGeometryChanged = this.mapGeometryChanged.bind(this);
    this.forceUpdate = this.forceUpdate.bind(this, undefined);
  }

  handleKeypress(event) {
    const fn = this.keymap[event.keyCode];
    if (typeof fn === 'function') fn();
  }

  changeMode(mode) {
    this.setState({mode});
  }

  publishMap() {
    if (!this.state.mapData) return;
    this.publishedMap = this.state.mapData;
    this.socket.emit('publishMap', this.publishedMap);
  }

  reset() {
    this.inputMap && this.inputMap.reset();
  }

  setBrushSize(newBrushSize) {
    let brushSize = newBrushSize;
    if (newBrushSize > this.props.config.input.brush.size.max) brushSize = this.props.config.input.brush.size.max;
    if (newBrushSize < this.props.config.input.brush.size.min) brushSize = this.props.config.input.brush.size.min;
    this.setState({brushSize});
  }

  setTerrain(newTerrain) {
    let terrain = newTerrain;
    if (terrain < 0) terrain = this.props.config.terrains.length - 1;
    if (terrain >= this.props.config.terrains.length) terrain = 0;
    this.setState({terrain});
  }

  processImageData() {
    if (this.unprocessedImageData) {
      setTimeout(this.updateImageData.bind(this, this.unprocessedImageData), 0);
      this.unprocessedImageData = undefined;
    }
  }

  updateImageData(imageData) {
    if (this.state.status !== 'ready') {
      this.unprocessedImageData = imageData;
      return;
    }
    this.setState({imageData, status: 'processing'}, () =>
      this.mapDataFactory.fromImageData(this.state.imageData).then(mapData =>
        this.setState({mapData, status: 'ready'}, this.processImageData)));
  }

  componentDidUpdate(prevProps, prevState) {
    if (EditApp.persistentSettings.some(key => this.state[key] !== prevState[key])) {
      const settings = EditApp.persistentSettings.reduce((persistentSettings, key) => {
        persistentSettings[key] = this.state[key];
        return persistentSettings;
      }, {});
      persistence.save('persistentEditAppSettings', settings);
    }
    if (prevState.mapData !== this.state.mapData) {
      persistence.save('mapData', this.state.mapData);
    }
  }

  componentDidMount() {
    this.setState({status: 'ready'}, this.processImageData);
    this.socket = io();
    this.socket.emit('joinRoom', {
      roomName: this.roomName,
      to: 'edit'
    });
    this.socket.on('joinedRoom', message => {
      if (message.to === 'play' && this.publishedMap) this.publishMap();
    });
    document.addEventListener('keydown', this.handleKeypress);
    window.addEventListener('resize', this.forceUpdate);
  }

  componentWillUnmount() {
    this.socket.disconnect();
    document.removeEventListener('keydown', this.handleKeypress);
    window.removeEventListener('resize', this.forceUpdate);
  }

  mapGeometryChanged() {
    this.inputMap.forceUpdate();
    this.outputMap.forceUpdate();
  }

  render() {
    document.title = this.state.title;
    let maps;
    let inputMap = (
      <InputMap
        ref={c => this.inputMap = c}
        updateImageData={this.updateImageData}
        imageData={this.state.imageData}
        config={this.props.config}
        terrain={this.state.terrain}
        brushSize={this.state.brushSize} />
    );
    let outputMap = (
      <OutputMap
        ref={c => this.outputMap = c}
        config={this.props.config}
        showScale={false}
        grid="off"
        mapData={this.state.mapData}>
        <p className="content-placeholder">Sketch a map and it will be rendered here</p>
      </OutputMap>
    );
    if (this.state.mode === 'horizontal-split') {
      maps = (
        <Bento
          geometryChanged={this.mapGeometryChanged}
          orientation="horizontal"
          minOffsetPercent={15}
          maxOffsetPercent={85}>
          {inputMap}
          {outputMap}
        </Bento>
      );
    }
    if (this.state.mode === 'overlay') {
      maps = (
        <div>
          {outputMap}
          <div className="overlay">
            {inputMap}
          </div>
        </div>
      );
    }
    return (
      <Bento
        geometryChanged={this.mapGeometryChanged}
        orientation="vertical"
        defaultOffsetPixels={150}
        minOffsetPixels={130}
        maxOffsetPixels={300}>
        <EditControls
          setTerrain={this.setTerrain}
          setBrushSize={this.setBrushSize}
          publishMap={this.publishMap}
          changeMode={this.changeMode}
          reset={this.reset}
          config={this.props.config}
          terrain={this.state.terrain}
          mode={this.state.mode}
          brushSize={this.state.brushSize}
          status={this.state.status} />
        {maps}
      </Bento>
    );
  }
}

EditApp.persistentSettings = ['terrain', 'brushSize', 'mode'];

module.exports = EditApp;
