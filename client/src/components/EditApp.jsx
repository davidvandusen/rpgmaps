require('../../styles/edit-app.scss');
const React = require('react');
const {connect} = require('react-redux');
const InputTool = require('./InputTool.jsx');
const EditCanvas = require('./EditCanvas.jsx');
const EditControls = require('./EditControls.jsx');
const {mouseInWorkspace} = require('../actions/mouseActions');
const {scaleWorkspaceToFitSurface, centerWorkspace, zoomWorkspace, resizeWorkspace} = require('../actions/workspaceActions');

class EditApp extends React.Component {
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
          <EditCanvas />
          <InputTool />
        </div>
        <EditControls />
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(EditApp);
