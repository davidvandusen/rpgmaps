import React, {Component} from 'react';
import '../../styles/edit-app.scss';
import Controls from './Controls.jsx';
import InputMap from './InputMap.jsx';
import Bento from './Bento.jsx';
import OutputMap from './OutputMap.jsx';
import {detectAreas} from '../common/imageData';
import {intToCssHex} from '../common/color';

export default class EditApp extends Component {
  constructor(props) {
    super(props);
    this.roomName = location.pathname.substring(1, location.pathname.indexOf('/', 1));
    this.state = {
      imageData: undefined,
      status: 'init',
      areas: undefined,
      terrain: 1,
      brushSize: this.props.config.input.brush.size.default,
      title: `Edit ${this.roomName} - RPG Maps`,
      mode: 'horizontal-split'
    };
    this.modes = [{
      id: 'horizontal-split',
      name: 'Horizontal Split'
    }, {
      id: 'overlay',
      name: 'Overlay'
    }];
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
    if (!this.state.areas || !this.state.areas.length) return;
    this.publishedMap = {areas: this.state.areas};
    this.socket.emit('publishMap', this.publishedMap);
  }

  reset() {
    this.inputMap && this.inputMap.reset();
  }

  setBrushSize(newBrushSize) {
    let brushSize = newBrushSize;
    if (newBrushSize > this.props.config.input.brush.size.max) {
      brushSize = this.props.config.input.brush.size.max;
    }
    if (newBrushSize < this.props.config.input.brush.size.min) {
      brushSize = this.props.config.input.brush.size.min;
    }
    this.setState({brushSize});
  }

  setTerrain(newTerrain) {
    let terrain = newTerrain;
    if (terrain < 0) {
      terrain = this.props.config.terrains.length - 1;
    }
    if (terrain >= this.props.config.terrains.length) {
      terrain = 0;
    }
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
    this.setState({imageData, status: 'processing'}, () => {
      this.updateAreas().then(() => {
        this.setState({status: 'ready'}, this.processImageData);
      });
    });
  }

  getTerrainFromArea(area) {
    const cssHex = intToCssHex(area.color);
    return this.props.config.terrains.find(terrain => terrain.color === cssHex);
  }

  updateAreas() {
    return detectAreas(this.state.imageData).then(areas => new Promise((resolve, reject) => this.setState({
      areas: areas.map(area => {
        const terrain = this.getTerrainFromArea(area);
        return {
          ctor: terrain.className,
          layer: terrain.layer,
          mask: area.mask
        };
      }).sort((areaA, areaB) => areaA.layer - areaB.layer)
    }, resolve)));
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
        areas={this.state.areas}>
        <p className="content-placeholder">Sketch a map and it will be rendered here</p>
      </OutputMap>
    );
    if (this.state.mode === 'horizontal-split') {
      maps = (
        <Bento
          ref={el => this.mapBento = el}
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
        ref={el => this.controlsBento = el}
        geometryChanged={this.mapGeometryChanged}
        orientation="vertical"
        defaultOffsetPixels={150}
        minOffsetPixels={130}
        maxOffsetPixels={300}>
        <Controls
          setTerrain={this.setTerrain}
          setBrushSize={this.setBrushSize}
          publishMap={this.publishMap}
          changeMode={this.changeMode}
          reset={this.reset}
          config={this.props.config}
          terrain={this.state.terrain}
          mode={this.state.mode}
          modes={this.modes}
          brushSize={this.state.brushSize}
          status={this.state.status} />
        {maps}
      </Bento>
    );
  }
}
