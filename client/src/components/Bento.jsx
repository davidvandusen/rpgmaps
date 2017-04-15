import React, {Component} from 'react';

export default class Bento extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dividerOffset: 0,
      dividerFraction: 0
    };
    this.handleGrabbed = this.handleGrabbed.bind(this);
    this.handleMoved = this.handleMoved.bind(this);
    this.handleDropped = this.handleDropped.bind(this);
    this.defaultDividerPosition = this.defaultDividerPosition.bind(this);
  }

  repositionDivider(x, y) {
    let dividerOffset;
    if (this.props.orientation === 'vertical') {
      dividerOffset = x - this.elBounds.left;
      if (this.props.minOffsetPercent) {
        const minPercentWidth = this.props.minOffsetPercent / 100 * this.elBounds.width;
        if (minPercentWidth > dividerOffset) dividerOffset = minPercentWidth;
      }
      if (this.props.maxOffsetPercent) {
        const maxPercentWidth = this.props.maxOffsetPercent / 100 * this.elBounds.width;
        if (maxPercentWidth < dividerOffset) dividerOffset = maxPercentWidth;
      }
      if (this.props.minOffsetDeltaPixels) {
        const minOffsetDelta = this.elBounds.width - this.props.minOffsetDeltaPixels;
        if (minOffsetDelta < dividerOffset) dividerOffset = minOffsetDelta;
      }
      if (this.props.maxOffsetDeltaPixels) {
        const maxOffsetDelta = this.elBounds.width - this.props.maxOffsetDeltaPixels;
        if (maxOffsetDelta > dividerOffset) dividerOffset = maxOffsetDelta;
      }
    } else if (this.props.orientation === 'horizontal') {
      dividerOffset = y - this.elBounds.top;
      if (this.props.minOffsetPercent) {
        const minPercentHeight = this.props.minOffsetPercent / 100 * this.elBounds.height;
        if (minPercentHeight > dividerOffset) dividerOffset = minPercentHeight;
      }
      if (this.props.maxOffsetPercent) {
        const maxPercentHeight = this.props.maxOffsetPercent / 100 * this.elBounds.height;
        if (maxPercentHeight < dividerOffset) dividerOffset = maxPercentHeight;
      }
      if (this.props.minOffsetDeltaPixels) {
        const minOffsetDelta = this.elBounds.height - this.props.minOffsetDeltaPixels;
        if (minOffsetDelta < dividerOffset) dividerOffset = minOffsetDelta;
      }
      if (this.props.maxOffsetDeltaPixels) {
        const maxOffsetDelta = this.elBounds.height - this.props.maxOffsetDeltaPixels;
        if (maxOffsetDelta > dividerOffset) dividerOffset = maxOffsetDelta;
      }
    }
    if (this.props.minOffsetPixels && this.props.minOffsetPixels > dividerOffset) {
      dividerOffset = this.props.minOffsetPixels;
    }
    if (this.props.maxOffsetPixels && this.props.maxOffsetPixels < dividerOffset) {
      dividerOffset = this.props.maxOffsetPixels;
    }
    if (dividerOffset !== this.state.dividerOffset) {
      let dividerFraction;
      if (this.props.orientation === 'horizontal') dividerFraction = dividerOffset / this.elBounds.height;
      else if (this.props.orientation === 'vertical') dividerFraction = dividerOffset / this.elBounds.width;
      this.setState({
        dividerFraction,
        dividerOffset
      }, () => {
        if (typeof this.props.geometryChanged === 'function') this.props.geometryChanged();
      });
    }
  }

  handleGrabbed() {
    this.handleBeingDragged = true;
  }

  handleMoved(event) {
    if (!this.handleBeingDragged) return;
    this.repositionDivider(event.clientX, event.clientY);
  }

  defaultDividerPosition() {
    const elBounds = this.el.getBoundingClientRect();
    let x = elBounds.left;
    let y = elBounds.top;
    if (this.props.defaultOffsetPercent) {
      x += elBounds.width * this.props.defaultOffsetPercent / 100;
      y += elBounds.height * this.props.defaultOffsetPercent / 100;
    } else if (this.props.defaultOffsetPixels) {
      x += this.props.defaultOffsetPixels;
      y += this.props.defaultOffsetPixels;
    } else {
      x += elBounds.width * 0.5;
      y += elBounds.height * 0.5;
    }
    this.repositionDivider(x, y);
  }

  handleDropped() {
    this.handleBeingDragged = false;
  }

  componentDidMount() {
    this.elBounds = this.el.getBoundingClientRect();
    this.defaultDividerPosition();
  }

  componentDidUpdate() {
    const elBounds = this.el.getBoundingClientRect();
    if (elBounds.width !== this.elBounds.width || elBounds.height !== this.elBounds.height) {
      this.elBounds = elBounds;
      this.repositionDivider(this.state.dividerFraction * this.elBounds.width, this.state.dividerFraction * this.elBounds.height);
    }
    if (this.orientation !== this.props.orientation) {
      this.orientation = this.props.orientation;
      this.defaultDividerPosition();
    }
  }

  render() {
    const classNames = [
      'bento',
      'bento-' + this.props.orientation
    ].join(' ');
    const styleA = {};
    const styleB = {};
    const styleDivider = {};
    if (this.el) {
      if (this.props.orientation === 'vertical') {
        styleA.width = this.state.dividerOffset - this.props.dividerSize / 2 + 'px';
        styleB.width = this.el.offsetWidth - this.state.dividerOffset - this.props.dividerSize / 2 + 'px';
        styleDivider.left = styleA.width;
        styleDivider.width = this.props.dividerSize + 'px';
      } else if (this.props.orientation === 'horizontal') {
        styleA.height = this.state.dividerOffset - this.props.dividerSize / 2 + 'px';
        styleB.height = this.el.offsetHeight - this.state.dividerOffset - this.props.dividerSize / 2 + 'px';
        styleDivider.top = styleA.height;
        styleDivider.height = this.props.dividerSize + 'px';
      }
    }
    return (
      <div
        ref={el => this.el = el}
        className={classNames}
        onMouseMove={this.handleMoved}
        onMouseUp={this.handleDropped}
        onMouseLeave={this.handleDropped}>
        <div
          className="bento-compartment bento-compartment-a"
          style={styleA}>
          {this.props.children[0]}
        </div>
        <hr
          ref={el => this.handle = el}
          className="bento-divider"
          style={styleDivider}
          onMouseDown={this.handleGrabbed}
          onDoubleClick={this.defaultDividerPosition} />
        <div
          className="bento-compartment bento-compartment-b"
          style={styleB}>
          {this.props.children[1]}
        </div>
      </div>
    );
  }
}

Bento.defaultProps = {
  dividerSize: 6
};
