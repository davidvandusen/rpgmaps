import React, {Component} from 'react';
import '../../styles/app.scss';
import Controls from './Controls.jsx';
import InputMap from './InputMap.jsx';
import VerticalResizeHandle from './VerticalResizeHandle.jsx';
import OutputMap from './OutputMap.jsx';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageData: undefined,
      status: 'init',
      terrain: 1,
      brushSize: this.props.config.input.brush.size.default
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
    this.setImageData = this.setImageData.bind(this);
    this.setTerrain = this.setTerrain.bind(this);
    this.setStatus = this.setStatus.bind(this);
    this.setBrushSize = this.setBrushSize.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset() {
    this.inputMap && this.inputMap.reset();
    this.updateImageData();
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

  setStatus(status) {
    this.setState({status});
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

  setImageData(imageData) {
    this.setState({imageData});
  }

  updateImageData() {
    this.outputMap && this.outputMap.forceUpdate();
  }

  handleKeypress(event) {
    const fn = this.keymap[event.keyCode];
    if (typeof fn === 'function') fn();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeypress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeypress);
  }

  render() {
    return (
      <div className="app">
        <Controls
          setTerrain={this.setTerrain}
          setBrushSize={this.setBrushSize}
          reset={this.reset}
          config={this.props.config}
          terrain={this.state.terrain}
          brushSize={this.state.brushSize}
          status={this.state.status} />
        <div className="container">
          <InputMap
            ref={c => this.inputMap = c}
            setImageData={this.setImageData}
            updateImageData={this.updateImageData}
            config={this.props.config}
            terrain={this.state.terrain}
            brushSize={this.state.brushSize} />
          <VerticalResizeHandle />
          <OutputMap
            ref={c => this.outputMap = c}
            setStatus={this.setStatus}
            config={this.props.config}
            status={this.state.status}
            imageData={this.state.imageData} />
        </div>
      </div>
    );
  }
}
