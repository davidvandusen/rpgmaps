const React = require('react');
const {connect} = require('react-redux');
const {publishMap} = require('../actions/dataActions');
const {setForeground, setBrushSize, setBrushShape} = require('../actions/inputActions');
const {setControlsHeight, closeMenu, openMenu, toggleMenu} = require('../actions/controlsActions');
const {scaleWorkspaceToFitSurface, centerWorkspace, zoomWorkspace} = require('../actions/workspaceActions');
const {importMap, exportMap} = require('../actions/persistenceActions');

class EditControls extends React.Component {
  onUpdate() {
    const elBounds = this.el.getBoundingClientRect();
    this.props.setControlsHeight(elBounds.height);
  }

  componentDidUpdate() {
    this.onUpdate();
  }

  componentDidMount() {
    this.onUpdate();
  }

  render() {
    return (
      <div
        ref={el => this.el = el}
        className="controls">

        <div className="controls-primary">

          <div
            className={'control' + (this.props.menuOpen === 'ABOUT' ? ' active' : '')}
            onClick={() => this.props.toggleMenu('ABOUT')}>
            <div className="control-label control-label-brand">
              <div className="control-label-major">RPG Maps</div>
              <div className="control-label-minor">About v{APP_VERSION}</div>
            </div>
            <div
              className={'control-dropdown' + (this.props.menuOpen === 'ABOUT' ? ' open' : '')}
              style={{width: '200px'}}>
              <div className="control">
                <div className="control-label">
                  <h2 className="control-label-major">About</h2>
                  <p>{APP_DESCRIPTION}</p>
                  <p><b>Current version:</b> v{APP_VERSION}</p>
                  <p><b>Created by:</b> <a href={APP_AUTHOR.url}>{APP_AUTHOR.name}</a></p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={'control' + (this.props.menuOpen === 'TERRAINS' ? ' active' : '')}
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
            <div className={'control-dropdown' + (this.props.menuOpen === 'TERRAINS' ? ' open' : '')}>
              {this.props.terrains.map((terrain, index) => (
                <div
                  key={terrain.color}
                  className={'control' + (terrain === this.props.currentTerrain ? ' active' : '')}>
                  <div
                    className="control-interactable"
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

          <div className="control">
            <div className="control-list">
              <div className="control-label">Brush:</div>
              <div
                className={'control-interactable' + (this.props.brushShape === 'CIRCLE' ? ' active' : '')}
                onClick={() => this.props.setBrushShape('CIRCLE')}>
                <div className="control-label">Circle</div>
              </div>
              <div
                className={'control-interactable' + (this.props.brushShape === 'SQUARE' ? ' active' : '')}
                onClick={() => this.props.setBrushShape('SQUARE')}>
                <div className="control-label">Square</div>
              </div>
            </div>
          </div>

          <div className="control" title="[ to decrease brush size, ] to increase brush size">
            <div className="control-label">Size:
              <span className="control-input">
                  <input
                    type="number"
                    style={{width: '3em'}}
                    value={this.props.brushSize}
                    onKeyDown={e => e.stopPropagation()}
                    onKeyUp={e => e.stopPropagation()}
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
                <div className="control-label">Fit</div>
              </div>
            </div>
          </div>

        </div>

        <div className="controls-auxiliary">

          <div
            className={'control' + (this.props.menuOpen === 'FILE' ? ' active' : '')}
            onClick={() => this.props.toggleMenu('FILE')}>
            <div className="control-label">File</div>
            <div className={'control-dropdown' + (this.props.menuOpen === 'FILE' ? ' open' : '')}>
              <div className="control">
                <div className="control-label" onClick={this.props.exportMap}>Export</div>
              </div>
              <div className="control">
                <div className="control-label" onClick={this.props.importMap}>Import</div>
              </div>
            </div>
          </div>

          <div className="control">
            <div
              className={'control-interactable' + (this.props.mapUpdated ? '' : ' disabled')}
              onClick={() => this.props.publishMap()}>
              <div className="control-label">Update Players</div>
            </div>
          </div>

          <div className="control">
            <div
              className="control-interactable"
              onClick={() => {
                this.props.publishMap();
                if (this._playWindow) this._playWindow.focus();
                else this._playWindow = window.open(`/${this.props.roomName}`, `play/${this.props.roomName}`);
              }}>
              <div className="control-label">Play Map</div>
            </div>
          </div>

        </div>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  mapUpdated: state.data.mapData !== state.data.publishedMap,
  roomName: state.ui.controls.roomName,
  width: state.ui.workspace.width,
  height: state.ui.workspace.height,
  menuOpen: state.ui.controls.menuOpen,
  brushSize: state.settings.input.brushSize,
  brushShape: state.settings.input.brushShape,
  zoom: state.ui.workspace.scale / state.settings.output.quality * 100,
  terrains: state.settings.input.terrains,
  currentTerrain: state.settings.input.terrains[state.settings.input.foreground]
});

const mapDispatchToProps = dispatch => ({
  toggleMenu: menu => dispatch(toggleMenu(menu)),
  openMenu: menu => dispatch(openMenu(menu)),
  closeMenu: () => dispatch(closeMenu()),
  setTerrain: foreground => {
    dispatch(setForeground(foreground));
  },
  setBrushShape: shape => dispatch(setBrushShape(shape)),
  onBrushSizeChange: event => {
    const brushSize = Number(event.target.value);
    if (brushSize) dispatch(setBrushSize(brushSize));
  },
  setControlsHeight: height => dispatch(setControlsHeight(height)),
  resetZoom: () => {
    dispatch(scaleWorkspaceToFitSurface());
    dispatch(zoomWorkspace(-1));
    dispatch(centerWorkspace());
  },
  zoomIn: () => dispatch(zoomWorkspace(1)),
  zoomOut: () => dispatch(zoomWorkspace(-1)),
  publishMap: () => dispatch(publishMap()),
  importMap: () => dispatch(importMap()),
  exportMap: () => dispatch(exportMap())
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(EditControls);
