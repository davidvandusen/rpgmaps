require('../../styles/edit-app.scss');
const React = require('react');
const {connect} = require('react-redux');
const InputImage = require('./InputImage.jsx');
const InputPaint = require('./InputPaint.jsx');
const InputTool = require('./InputTool.jsx');
const OutputImage = require('./OutputImage.jsx');
const CrossfadeImage = require('./CrossfadeImage.jsx');
const EditControls = require('./EditControls.jsx');
const {mouseInWorkspace, scaleToFit, centerSurface} = require('../actions/actionCreators');

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
          <OutputImage />
          <CrossfadeImage />
          <InputImage />
          <InputPaint />
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
    dispatch(scaleToFit());
    dispatch(centerSurface());
  }
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(EditApp);
