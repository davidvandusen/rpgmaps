const React = require('react');
const {connect} = require('react-redux');
const {setControlsHeight, closeMenu, openMenu, toggleMenu} = require('../actions/controlsActions');
const {scaleWorkspaceToFitSurface, centerWorkspace, zoomWorkspace} = require('../actions/workspaceActions');
const {setGridType, setGridSpacing, setGridLineColor} = require('../actions/gridActions');
const {createToken, deleteToken, nameToken, describeToken} = require('../actions/tokensActions');

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

          <div
            className={'control' + (this.props.menuOpen === 'TOKENS' ? ' active' : '')}
            onClick={() => this.props.toggleMenu('TOKENS')}>
            <div className="control-label">Tokens</div>
          </div>
          <div
            className={'control-dropdown' + (this.props.menuOpen === 'TOKENS' ? ' open' : '')}
            style={{width: '200px'}}>
            {
              this.props.tokens.length === 0 &&
              <div className="control">
                <div className="control-label control-readonly">No tokens</div>
              </div>
            }
            {this.props.tokens.map(token => (
              <div
                key={token._id}
                className="control">
                <div className="control-list">
                  <div className="control-input">
                    <input
                      type="text"
                      style={{width: '2em'}}
                      value={token.name}
                      onKeyDown={e => e.stopPropagation()}
                      onKeyUp={e => e.stopPropagation()}
                      onChange={event => {
                        this.props.nameToken(token._id, event.target.value);
                      }} />
                  </div>
                  <div className="control-input">
                    <input
                      type="text"
                      style={{width: '8em'}}
                      value={token.description}
                      onKeyDown={e => e.stopPropagation()}
                      onKeyUp={e => e.stopPropagation()}
                      onChange={event => {
                        this.props.describeToken(token._id, event.target.value);
                      }} />
                  </div>
                  <div
                    className="control-interactable"
                    onClick={() => {
                      this.props.deleteToken(token._id);
                    }}>
                    <div className="control-label">&times;</div>
                  </div>
                </div>
              </div>
            ))}
            <hr />
            <div className="control" style={{justifyContent: 'flex-end'}}>
              <div className="control-list">
                <div
                  className="control-interactable"
                  onClick={() => {
                    this.props.createToken();
                  }}>
                  <div className="control-label" style={{whiteSpace: 'nowrap'}}>New Token</div>
                </div>
                <div
                  className="control-interactable"
                  onClick={() => {
                    this.props.closeMenu();
                  }}>
                  <div className="control-label">Done</div>
                </div>
              </div>
            </div>
          </div>

          <div className="control">
            <div className="control-label">Spacing:
              <span className="control-input">
                  <input
                    type="number"
                    style={{width: '3em'}}
                    value={this.props.gridSpacing}
                    onKeyDown={e => e.stopPropagation()}
                    onKeyUp={e => e.stopPropagation()}
                    onChange={event => {
                      const gridSpacing = Number(event.target.value);
                      if (gridSpacing) this.props.setGridSpacing(gridSpacing);
                    }} />
                </span>
            </div>
          </div>

          <div className="control">
            <div className="control-list">
              <div className="control-label">Type:</div>
              <div
                className={'control-interactable' + (this.props.gridType === 'pointy-top-hex' ? ' active' : '')}
                onClick={() => this.props.setGridType('pointy-top-hex')}>
                <div className="control-label">Pointy Top Hex</div>
              </div>
              <div
                className={'control-interactable' + (this.props.gridType === 'flat-top-hex' ? ' active' : '')}
                onClick={() => this.props.setGridType('flat-top-hex')}>
                <div className="control-label">Flat Top Hex</div>
              </div>
              <div
                className={'control-interactable' + (this.props.gridType === 'square' ? ' active' : '')}
                onClick={() => this.props.setGridType('square')}>
                <div className="control-label">Square</div>
              </div>
            </div>
          </div>

          <div className="control">
            <div className="control-list">
              <div className="control-label">Color:</div>
              <div
                className={'control-interactable' + (this.props.gridLineColor === 'black' ? ' active' : '')}
                onClick={() => this.props.setGridLineColor('black')}>
                <div className="control-label">Black</div>
              </div>
              <div
                className={'control-interactable' + (this.props.gridLineColor === 'white' ? ' active' : '')}
                onClick={() => this.props.setGridLineColor('white')}>
                <div className="control-label">White</div>
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
                <div className="control-label">Fit</div>
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
  tokens: state.settings.tokens,
  gridType: state.settings.grid.type,
  gridSpacing: state.settings.grid.spacing,
  gridLineColor: state.settings.grid.lineColor,
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
  zoomOut: () => dispatch(zoomWorkspace(-1)),
  setGridType: type => dispatch(setGridType(type)),
  setGridSpacing: gridSpacing => dispatch(setGridSpacing(gridSpacing)),
  setGridLineColor: color => dispatch(setGridLineColor(color)),
  createToken: () => dispatch(createToken()),
  deleteToken: _id => dispatch(deleteToken(_id)),
  nameToken: (_id, name) => dispatch(nameToken(_id, name)),
  describeToken: (_id, description) => dispatch(describeToken(_id, description))
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(PlayControls);
