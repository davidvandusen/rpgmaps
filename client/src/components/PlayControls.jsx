const React = require('react');

class PlayControls extends React.Component {
  render() {
    return (
      <div className="controls">
        <div className="control-list">
          <div className="control-meta">
            <span className="control-meta-key">RPG Maps</span>
            <span className="control-meta-value">v{APP_VERSION}</span>
          </div>
        </div>
        <div className="control-list">
          <div className="control-list-heading">Grid Mode</div>
          {this.props.config.output.grid.options.map(grid => (
            <div
              key={grid.id}
              className={`control-list-item interactable ${this.props.grid === grid.id ? 'current' : ''}`}
              onClick={this.props.changeGrid.bind(null, grid.id)}>
              <div className="control-list-item-heading">{grid.name}</div>
            </div>
          ))}
        </div>
        <div className="control-list">
          <div className="control-list-heading">Tokens</div>
          <div
            className="control-list-item interactable"
            onClick={this.props.createToken}>
            <div className="control-list-item-heading">Create Token</div>
          </div>
          {this.props.tokens.map((token, i) => (
            <div key={token.id} className="control-list-item">
              <span
                className="control-list-item-delete"
                onClick={this.props.deleteToken.bind(undefined, token.id)}>&times;</span>
              <input
                className="value-input narrow"
                defaultValue={token.name}
                onChange={evt => this.props.updateToken(token.id, {name: evt.target.value})} />
              <input
                className="value-input wide"
                defaultValue={token.banner}
                onChange={evt => this.props.updateToken(token.id, {banner: evt.target.value})} />
            </div>
          ))}
        </div>
      </div>
    )
  }
}

module.exports = PlayControls;
