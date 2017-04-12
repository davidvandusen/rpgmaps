import React, {Component} from 'react';

export default class Controls extends Component {
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
          <div className="control-list-heading">Publication</div>
          <div className="control-list-item interactable" onClick={this.props.publishMap}>
            <div className="control-list-item-heading">Publish Current Map</div>
          </div>
          <a className="control-list-item interactable" href={location.href.substring(0, location.href.indexOf('/edit'))} target="_blank">
            <div className="control-list-item-heading">Play Map &#x2197;</div>
          </a>
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
          <div className="control-list-item">
            <input
              className="search-input"
              ref={el => this.searchInput = el}
              placeholder="Search..." />
          </div>
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
