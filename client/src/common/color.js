function intToRgba(int) {
  return [
    int & 0xff,
    int >> 8 & 0xff,
    int >> 16 & 0xff,
    int >> 24 & 0xff
  ];
}

function rgbaToCss(red, green, blue, alpha) {
  return `rgba(${red},${green},${blue},${alpha / 255})`;
}

function intToCss(int) {
  return rgbaToCss(...intToRgba(int));
}

function rgbaToCssHex(red, green, blue) {
  let redHex = red.toString(16);
  if (redHex.length === 1) redHex = '0' + redHex;
  let greenHex = green.toString(16);
  if (greenHex.length === 1) greenHex = '0' + greenHex;
  let blueHex = blue.toString(16);
  if (blueHex.length === 1) blueHex = '0' + blueHex;
  return `#${redHex}${greenHex}${blueHex}`;
}

function intToCssHex(int) {
  return rgbaToCssHex(...intToRgba(int));
}

// HACK Technically these don't associate the presence of "a" in "rgba" with the number of values
const rgbaDecimalPattern = /^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(,\s*(\d+\.?\d+))?\s*\)$/;
const rgbaPercentPattern = /^rgba?\(\s*(\d+)%,\s*(\d+)%,\s*(\d+)%(,\s*(\d+\.?\d+))?\s*\)$/;

function cssToRgba(css) {
  if (css.startsWith('#')) {
    if (css.length === 4) {
      return [
        parseInt(css[1] + css[1], 16),
        parseInt(css[2] + css[2], 16),
        parseInt(css[3] + css[3], 16),
        0xff
      ];
    }
    if (css.length === 7) {
      return [
        parseInt(css[1] + css[2], 16),
        parseInt(css[3] + css[4], 16),
        parseInt(css[5] + css[6], 16),
        0xff
      ];
    }
  }
  if (rgbaPercentPattern.test(css)) {
    const matches = rgbaPercentPattern.exec(css);
    return [
      Math.ceil(parseInt(matches[1], 10) * 0xff / 100),
      Math.ceil(parseInt(matches[2], 10) * 0xff / 100),
      Math.ceil(parseInt(matches[3], 10) * 0xff / 100),
      matches.length === 6 ? parseInt(matches[5], 10) : 0xff,
    ];
  }
  if (rgbaDecimalPattern.test(css)) {
    const matches = rgbaDecimalPattern.exec(css);
    return [
      parseInt(matches[1], 10),
      parseInt(matches[2], 10),
      parseInt(matches[3], 10),
      matches.length === 6 ? parseInt(matches[5], 10) : 0xff,
    ];
  }
  return [0, 0, 0, 0];
}

export {
  intToRgba,
  rgbaToCss,
  rgbaToCssHex,
  intToCss,
  intToCssHex,
  cssToRgba
}
