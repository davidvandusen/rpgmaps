import React, {Component} from 'react';
import '../../styles/edit-app.scss';
import Controls from './Controls.jsx';
import InputMap from './InputMap.jsx';
import Bento from './Bento.jsx';
import OutputMap from './OutputMap.jsx';
import {detectAreas} from '../lib/imageDataCommon';
import {intToCssHex} from '../lib/colorCommon';

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
      title: `Edit ${this.roomName} - RPG Maps`
    };
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
    this.forceUpdate = this.forceUpdate.bind(this, undefined);
  }

  handleKeypress(event) {
    const fn = this.keymap[event.keyCode];
    if (typeof fn === 'function') fn();
  }

  publishMap() {
    if (!this.state.areas || !this.state.areas.length) return;
    this.socket.emit('publishMap', {areas: this.state.areas});
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

  updateImageData(imageData) {
    if (this.state.status !== 'ready') {
      this.unprocessedImageData = imageData;
      return;
    }
    this.setState({status: 'processing'}, () => {
      this.updateAreas(imageData).then(() => {
        this.setState({status: 'ready'}, () => {
          if (this.unprocessedImageData) {
            setTimeout(this.updateImageData.bind(this, this.unprocessedImageData), 0);
            this.unprocessedImageData = undefined;
          }
        });
      });
    });
  }

  getTerrainFromArea(area) {
    const cssHex = intToCssHex(area.color);
    return this.props.config.terrains.find(terrain => terrain.color === cssHex);
  }

  updateAreas(imageData) {
    return detectAreas(imageData).then(areas => new Promise((resolve, reject) => this.setState({
      areas: areas.map(area => {
        const terrain = this.getTerrainFromArea(area);
        return {
          layer: terrain.layer,
          mask: area.mask,
          ctor: terrain.className
        };
      }).sort((areaA, areaB) => areaA.layer - areaB.layer)
    }, resolve)));
  }

  componentDidMount() {
    this.setState({status: 'ready'});
    this.socket = io();
    this.socket.emit('joinRoom', {
      roomName: this.roomName,
      to: 'edit'
    });
    document.addEventListener('keydown', this.handleKeypress);
    window.addEventListener('resize', this.forceUpdate)
  }

  componentWillUnmount() {
    this.socket.disconnect();
    document.removeEventListener('keydown', this.handleKeypress);
    window.removeEventListener('resize', this.forceUpdate)
  }

  render() {
    document.title = this.state.title;
    return (
      <Bento
        orientation="vertical"
        defaultOffsetPixels={150}
        minOffsetPixels={130}
        maxOffsetPixels={300}>
        <Controls
          setTerrain={this.setTerrain}
          setBrushSize={this.setBrushSize}
          publishMap={this.publishMap}
          reset={this.reset}
          config={this.props.config}
          terrain={this.state.terrain}
          brushSize={this.state.brushSize}
          status={this.state.status} />
        <Bento
          orientation="horizontal"
          minOffsetPercent={10}
          maxOffsetPercent={90}>
          <InputMap
            ref={c => this.inputMap = c}
            updateImageData={this.updateImageData}
            config={this.props.config}
            terrain={this.state.terrain}
            brushSize={this.state.brushSize} />
          <OutputMap
            ref={c => this.outputMap = c}
            config={this.props.config}
            areas={this.state.areas}>
            <p>Sketch a map and it will be rendered here</p>
          </OutputMap>
        </Bento>
      </Bento>
    );
  }
}
