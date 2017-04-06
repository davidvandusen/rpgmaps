export default class AreaMask {
  constructor(size, width) {
    this.size = size;
    this.width = width;
    this.height = Math.floor(this.size / this.width);
    this.data = new Uint8Array(Math.ceil(size / 8));
    this.n = 0;
  }

  coords(i) {
    return [i % this.width, Math.floor(i / this.width)];
  }

  index(x, y) {
    if (x >= this.width || y >= this.height) return -1;
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

  empty() {
    return this.n === 0;
  }

  full() {
    return this.n === this.size;
  }

  set(i, val) {
    const word = Math.floor(i / 8);
    const bit = i % 8;
    if (val) {
      if (!this.get(i)) this.n++;
      this.data[word] |= 1 << bit;
    } else {
      if (this.get(i)) this.n--;
      this.data[word] &= ~(1 << bit);
    }
  }
}
