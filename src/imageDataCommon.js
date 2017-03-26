function coordsFromDataPoint(i, w, components = 4) {
  const n = Math.floor(i / components);
  return [n % w, Math.floor(n / w)];
}

function fillImageData(imageData, color) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = color[0];
    data[i + 1] = color[1];
    data[i + 2] = color[2];
    data[i + 3] = color[3] || 0xff;
  }
}

function countPixelColors(imageData) {
  const data = imageData.data;
  let colors = {};
  for (let i = 0; i < data.length; i += 4) {
    const color = `rgba(${data[i]},${data[i + 1]},${data[i + 2]},${data[i + 3]})`;
    if (!colors[color]) {
      colors[color] = 0;
    }
    colors[color]++;
  }
  return colors;
}

function detectAreas(imageData) {
  let pixels = new Uint32Array(imageData.data.buffer);
  return contiguousArea(pixels, imageData.width, 0).then(area => {
    return Promise.resolve([area]);
  });
}

function contiguousArea(pixels, width, startIndex) {
  return new Promise((resolve, reject) => {
    const targetColor = pixels[startIndex];
    let out = new Uint8Array(pixels.length);
    (function floodFill(index) {
      // target is already set, return
      if (out[index]) return Promise.resolve();
      // if target is not same colour, return
      if (pixels[index] !== targetColor) return Promise.resolve();
      // set the target bit
      out[index] = 0xff;
      const promises = [];
      if (index >= width) {
        promises.push(new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(floodFill(index - width));
          }, 0);
        }));
      }
      if (index % width !== width - 1) {
        promises.push(new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(floodFill(index + 1));
          }, 0);
        }));
      }
      if (pixels.length >= index + width) {
        promises.push(new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(floodFill(index + width));
          }, 0);
        }));
      }
      if (index > 0 && index % width > 0) {
        promises.push(new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(floodFill(index - 1));
          }, 0);
        }));
      }
      return Promise.all(promises);
    }(startIndex)).then(() => {
      resolve(out);
    });
  });
}

export {
  coordsFromDataPoint,
  fillImageData,
  countPixelColors,
  detectAreas
};
