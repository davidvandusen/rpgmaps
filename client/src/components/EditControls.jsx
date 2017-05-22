const React = require('react');
const {connect} = require('react-redux');
const {setTerrain, setControlsHeight, setBrushSize, scaleToFit, centerSurface, scaleSurface, toggleMenu} = require('../actions/actionCreators');

class EditControls extends React.Component {
  componentDidMount() {
    const elBounds = this.el.getBoundingClientRect();
    this.props.setControlsHeight(elBounds.height);
  }

  render() {
    return (
      <div
        ref={el => this.el = el}
        className="controls">
        <div className="controls-primary">
          <div className="control">
            <div
              className={'control-interactable' + (this.props.openMenu === 'TERRAINS' ? ' active' : '')}
              onClick={() => this.props.toggleMenu('TERRAINS')}>
              <canvas
                className="control-thumbnail"
                width="40"
                height="40"
                style={{background: this.props.currentTerrain.color}} />
              <div className="control-label">
                <div className="control-label-major">{this.props.currentTerrain.name}</div>
                <div className="control-label-minor" style={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  width: '160px'
                }}>{this.props.currentTerrain.description}</div>
              </div>
            </div>
            <div className={'control-dropdown' + (this.props.openMenu === 'TERRAINS' ? ' open' : '')}>
              {this.props.terrains.map((terrain, index) => (
                <div
                  key={terrain.color}
                  className="control">
                  <div
                    className={'control-interactable' + (terrain === this.props.currentTerrain ? ' active' : '')}
                    onClick={() => this.props.setTerrain(index)}>
                    <canvas
                      className="control-thumbnail"
                      width="40"
                      height="40"
                      style={{background: terrain.color}} />
                    <div className="control-label">
                      <div className="control-label-major">{terrain.name}</div>
                      <div className="control-label-minor">{terrain.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="control" title="[ to decrease brush size, ] to increase brush size">
            <div className="control-label">Brush size:
              <span className="control-input">
                <input
                  type="number"
                  style={{width: '3em'}}
                  value={this.props.brushSize}
                  onChange={this.props.onBrushSizeChange} />
              </span>
            </div>
          </div>
          <div className="control">
            <div className="control-list">
              <div className="control-label">Zoom:</div>
              <div
                className="control-interactable"
                title="scroll wheel"
                onClick={this.props.zoomOut}>
                <div className="control-label">-</div>
              </div>
              <div
                className="control-label"
                style={{textAlign: 'center', width: '3em'}}>{Math.round(this.props.zoom)}%
              </div>
              <div
                className="control-interactable"
                title="scroll wheel"
                onClick={this.props.zoomIn}>
                <div className="control-label">+</div>
              </div>
              <div
                className="control-interactable"
                title="Z"
                onClick={this.props.resetZoom}>
                <div className="control-label">Reset</div>
              </div>
            </div>
          </div>
        </div>
        <div className="controls-auxiliary">
          <div className="control">
            <div className="control-interactable">
              <div className="control-label">Play Map</div>
            </div>
          </div>
          <div className="control">
            <div className="control-interactable">
              <div className="control-label control-label-brand">
                <div className="control-label-major">RPG Maps</div>
                <div className="control-label-minor">About v{APP_VERSION}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  openMenu: state.ui.menuOpen,
  brushSize: state.settings.brush.size,
  zoom: (state.workspace.surface.height * state.workspace.scale) / (state.workspace.height - state.workspace.controlsHeight) * 100,
  terrains: state.settings.terrains,
  currentTerrain: state.settings.terrains[state.settings.terrain]
});

const mapDispatchToProps = dispatch => ({
  toggleMenu: menu => dispatch(toggleMenu(menu)),
  setTerrain: index => dispatch(setTerrain(index)),
  onBrushSizeChange: event => {
    const brushSize = Number(event.target.value);
    if (brushSize) dispatch(setBrushSize(brushSize));
  },
  setControlsHeight: height => dispatch(setControlsHeight(height)),
  resetZoom: () => {
    dispatch(scaleToFit());
    dispatch(centerSurface());
  },
  zoomIn: () => dispatch(scaleSurface(1)),
  zoomOut: () => dispatch(scaleSurface(-1))
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(EditControls);
