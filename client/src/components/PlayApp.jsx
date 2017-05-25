require('../../styles/edit-app.scss');
const React = require('react');
const {connect} = require('react-redux');
const {mouseInWorkspace} = require('../actions/mouseActions');
const {scaleWorkspaceToFitSurface, centerWorkspace, zoomWorkspace, resizeWorkspace} = require('../actions/workspaceActions');
const Grid = require('./Grid.jsx');
const PlayCanvas = require('./PlayCanvas.jsx');
const PlayControls = require('./PlayControls.jsx');
const Tokens = require('./Tokens.jsx');

class PlayApp extends React.Component {
  componentDidMount() {
    this.props.onComponentDidMount();
  }

  render() {
    return (
      <div className="edit-app">
        <div
          className="workspace"
          onMouseEnter={this.props.onMouseEnterWorkspace}
          onMouseLeave={this.props.onMouseLeaveWorkspace}>
          <PlayCanvas />
          <Grid />
          <Tokens />
        </div>
        <PlayControls />
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  onMouseEnterWorkspace: () => dispatch(mouseInWorkspace(true)),
  onMouseLeaveWorkspace: () => dispatch(mouseInWorkspace(false)),
  onComponentDidMount: () => {
    dispatch(resizeWorkspace(window.innerWidth, window.innerHeight));
    dispatch(scaleWorkspaceToFitSurface());
    dispatch(zoomWorkspace(-1));
    dispatch(centerWorkspace());
  }
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(PlayApp);
