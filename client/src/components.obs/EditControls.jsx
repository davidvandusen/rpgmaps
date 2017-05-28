const React = require('react');

class EditControls extends React.Component {
  constructor(props) {
    super(props);
    this.onBrushSizeChange = this.onBrushSizeChange.bind(this);
  }

  onBrushSizeChange() {
    this.props.setBrushSize(Number(this.brushSizeInput.value));
  }

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
          <div className="control-list-heading">Publication</div>
          <div className="control-list-item interactable" onClick={this.props.publishMap}>
            <div className="control-list-item-heading">Show To Players</div>
          </div>
          <a
            className="control-list-item interactable"
            onClick={this.props.publishMap}
            href={location.href.substring(0, location.href.indexOf('/edit'))}
            target="_blank">
            <div className="control-list-item-heading">Play Map &#x2197;</div>
          </a>
        </div>
        <div className="control-list">
          <div className="control-list-heading">Editor Mode</div>
          {this.props.config.ui.mode.options.map(mode => (
            <div
              key={mode.id}
              className={`control-list-item interactable ${this.props.mode === mode.id ? 'current' : ''}`}
              onClick={this.props.changeMode.bind(null, mode.id)}>
              <div className="control-list-item-heading">{mode.name}</div>
            </div>
          ))}
        </div>
        <div className="control-list">
          <div className="control-list-heading">Brush Settings</div>
          <div className="control-list-item">
            <span className="control-list-item-heading">Size</span>
            <span className="control-list-item-input">
              <input
                className="value-input"
                type="number"
                ref={el => this.brushSizeInput = el}
                value={this.props.brushSize}
                onChange={this.onBrushSizeChange} />
            </span>
          </div>
        </div>
        <div className="control-list">
          <div className="control-list-heading">Terrains &amp; Objects</div>
          {this.props.config.terrains.map((terrain, i) => (
            <div
              key={terrain.color}
              className={`control-list-item interactable ${this.props.terrain === i ? 'current' : ''}`}
              onClick={this.props.setTerrain.bind(null, i)}>
              <span className="control-list-item-swatch" style={{background: terrain.color}} />
              <span className="control-list-item-heading">{terrain.name}</span>
            </div>
          ))}
        </div>
        <div className="control-list">
          <div className="control-list-heading">Start Over?</div>
          <div className="control-list-item interactable danger" onClick={this.props.reset}>Clear Map!</div>
        </div>
        <div className="processing">
          {this.props.status === 'init' ? (
            <div>
              Initializing...
            </div>
          ) : this.props.status === 'processing' ? (
            <div>
              <span className="dot" />
              Processing...
            </div>
          ) : (
            <div>&nbsp;</div>
          )}
        </div>
      </div>
    )
  }
}

module.exports = EditControls;
