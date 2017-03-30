export default class AreaMask {
  static from(pixels, width, startIndex) {
    let cancelled = false;
    const createMask = new Promise((resolve, reject) => {
      const mask = new AreaMask(pixels.length);
      const color = pixels[startIndex];
      const floodFillFromStartIndex = (function floodFill(index) {
        if (cancelled) return Promise.reject();
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
      floodFillFromStartIndex.then(() => resolve(mask));
    });
    createMask.cancel = () => {
      cancelled = true;
    };
    return createMask;
  }

  constructor(length) {
    this.length = length;
    this.data = new Uint8Array(Math.ceil(length / 8));
  }

  get(i) {
    const word = Math.floor(i / 8);
    const bit = i % 8;
    return !!(this.data[word] & 1 << bit);
  }

  set(i, val) {
    const word = Math.floor(i / 8);
    const bit = i % 8;
    if (val) this.data[word] |= 1 << bit;
    else this.data[word] &= ~(1 << bit);
  }
}
