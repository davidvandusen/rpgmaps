const React = require('react');
const {connect} = require('react-redux');
const {setControlsHeight, closeMenu, openMenu, toggleMenu} = require('../actions/controlsActions');
const {scaleWorkspaceToFitSurface, centerWorkspace, zoomWorkspace} = require('../actions/workspaceActions');

class PlayControls extends React.Component {
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
              <hr />
              <div className="control" style={{justifyContent: 'flex-end'}}>
                <div className="control-list">
                  <div
                    className="control-interactable"
                    onClick={event => {
                      event.stopPropagation();
                      this.props.closeMenu();
                    }}>
                    <div className="control-label">OK</div>
                  </div>
                </div>
              </div>
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
            <div
              className="control-interactable"
              onClick={() => window.open(`/${this.props.roomName}/edit`, `edit/${this.props.roomName}`)}>
            <div className="control-label">Edit Map</div>
            </div>
          </div>

        </div>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  roomName: state.ui.controls.roomName,
  width: state.ui.workspace.width,
  height: state.ui.workspace.height,
  menuOpen: state.ui.controls.menuOpen,
  zoom: state.ui.workspace.scale / state.settings.output.quality * 100
});

const mapDispatchToProps = dispatch => ({
  toggleMenu: menu => dispatch(toggleMenu(menu)),
  openMenu: menu => dispatch(openMenu(menu)),
  closeMenu: () => dispatch(closeMenu()),
  setControlsHeight: height => dispatch(setControlsHeight(height)),
  resetZoom: () => {
    dispatch(scaleWorkspaceToFitSurface());
    dispatch(zoomWorkspace(-1));
    dispatch(centerWorkspace());
  },
  zoomIn: () => dispatch(zoomWorkspace(1)),
  zoomOut: () => dispatch(zoomWorkspace(-1))
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(PlayControls);
