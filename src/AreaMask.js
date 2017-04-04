export default class AreaMask {
  constructor(size, width) {
    this.size = size;
    this.width = width;
    this.height = Math.floor(this.size / this.width);
    this.data = new Uint8Array(Math.ceil(size / 8));
  }

  coords(i) {
    return [i % this.width, Math.floor(i / this.width)];
  }

  index(x, y) {
    return y * this.width + x;
  }

  valid(i) {
    return i >= 0 && i < this.size;
  }

  get(i) {
    if (!this.valid(i)) return false;
    const word = Math.floor(i / 8);
    const bit = i % 8;
    return !!(this.data[word] & 1 << bit);
  }

  at(x, y) {
    return this.get(this.index(x, y));
  }

  set(i, val) {
    const word = Math.floor(i / 8);
    const bit = i % 8;
    if (val) this.data[word] |= 1 << bit;
    else this.data[word] &= ~(1 << bit);
  }
}
