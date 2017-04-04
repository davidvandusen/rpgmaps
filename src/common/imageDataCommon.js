import seedrandom from 'seedrandom';
import AreaMask from '../AreaMask';

function fillImageData(imageData, red, green, blue, alpha) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = red;
    data[i + 1] = green;
    data[i + 2] = blue;
    data[i + 3] = alpha;
  }
}

function detectAreas(imageData) {
  let pixels = new Uint32Array(imageData.data.buffer);
  return new Promise((resolve, reject) =>
    setTimeout(() =>
      resolve(detectAreasRecursive(pixels, imageData.width, [])), 0));
}

function firstUnmaskedPixel(length, areas) {
  if (!areas.length) return 0;
  for (let i = 0; i < length; i++) if (!areas.some(area => area.mask.get(i))) return i;
  return -1;
}

function detectAreasRecursive(pixels, width, areas) {
  const startIndex = firstUnmaskedPixel(pixels.length, areas);
  if (startIndex === -1) return Promise.resolve(areas);
  return describeContiguousArea(pixels, width, startIndex)
    .then(area => detectAreasRecursive(pixels, width, areas.concat([area])));
}

function describeContiguousArea(pixels, width, startIndex) {
  return new Promise((resolve, reject) => {
    const mask = new AreaMask(pixels.length, width);
    const color = pixels[startIndex];
    const floodFillFromStartIndex = (function floodFill(index) {
      if (mask.get(index)) return Promise.resolve();
      if (pixels[index] !== color) return Promise.resolve();
      mask.set(index, true);
      const nextIndices = [];
      if (index >= width) nextIndices.push(index - width);
      if (index % width !== width - 1) nextIndices.push(index + 1);
      if (pixels.length >= index + width) nextIndices.push(index + width);
      if (index > 0 && index % width > 0) nextIndices.push(index - 1);
      return Promise.all(
        nextIndices.map(index =>
          new Promise((resolve, reject) =>
            setTimeout(() =>
              resolve(floodFill(index)), 0))));
    }(startIndex));
    floodFillFromStartIndex.then(() => resolve({color, mask}));
  });
}

function outlineMask(mask) {
  let pos;
  let start;
  for (let index = 0; pos === undefined && index < mask.size; index++) {
    if (mask.get(index)) {
      pos = mask.coords(index);
      start = pos;
    }
  }
  const outline = [];
  do {
    const last = outline[outline.length - 1];
    outline.push(pos);
    const se = mask.at(pos[0], pos[1]);
    const sw = mask.at(pos[0] - 1, pos[1]);
    const nw = mask.at(pos[0] - 1, pos[1] - 1);
    const ne = mask.at(pos[0], pos[1] - 1);
    const s = [pos[0], pos[1] + 1];
    const w = [pos[0] - 1, pos[1]];
    const n = [pos[0], pos[1] - 1];
    const e = [pos[0] + 1, pos[1]];
    if (last === undefined || last[0] === s[0] && last[1] === s[1]) {
      if (se !== ne) pos = e;
      else if (nw !== ne) pos = n;
      else if (nw !== sw) pos = w;
    } else if (last[0] === w[0] && last[1] === w[1]) {
      if (se !== sw) pos = s;
      else if (se !== ne) pos = e;
      else if (nw !== ne) pos = n;
    } else if (last[0] === n[0] && last[1] === n[1]) {
      if (nw !== sw) pos = w;
      else if (se !== sw) pos = s;
      else if (se !== ne) pos = e;
    } else if (last[0] === e[0] && last[1] === e[1]) {
      if (nw !== ne) pos = n;
      else if (nw !== sw) pos = w;
      else if (se !== sw) pos = s;
    }
  } while (!(pos[0] === start[0] && pos[1] === start[1]));
  return outline;
}

function smoothOutline(outline, amount) {
  const amt = Math.floor(amount);
  const n = amt * 2;
  const points = [];
  for (let i = 0; i < outline.length; i++) {
    let sx = 0;
    let sy = 0;
    for (let p = i - amt; p < i + amt; p++) {
      const index = p < 0 ? outline.length + p : p >= outline.length ? p - outline.length : p;
      sx += outline[index][0];
      sy += outline[index][1];
    }
    points.push([sx / n, sy / n]);
  }
  return points;
}

function addNoise(ctx, amount) {
  const rng = seedrandom('');
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const by = (rng() * 2 - 1) * amount;
    imageData.data[i] += by;
    imageData.data[i + 1] += by;
    imageData.data[i + 2] += by;
  }
  ctx.putImageData(imageData, 0, 0);
}

export {
  fillImageData,
  detectAreas,
  outlineMask,
  smoothOutline,
  addNoise
};
