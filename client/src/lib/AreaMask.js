import base64 from 'base64-js';

function countSetBits(n) {
  let c;
  for (c = 0; n; n = n & (n - 1)) c++;
  return c;
}

export default class AreaMask {
  static fromJSON(obj) {
    const mask = new AreaMask(obj.size, obj.width);
    mask.data = base64.toByteArray(obj.data);
    let n = 0;
    for (let i = 0; i < mask.data.length; i++) {
      n += countSetBits(mask.data[i]);
    }
    mask.n = n;
    return mask;
  }

  constructor(size, width) {
    this.size = size;
    this.width = width;
    this.height = Math.floor(this.size / this.width);
    this.data = new Uint8Array(Math.ceil(size / 8));
    this.n = 0;
  }

  toJSON() {
    return {
      size: this.size,
      width: this.width,
      data: base64.fromByteArray(this.data)
    };
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

  equals(areaMask) {
    if (areaMask.data.length !== this.data.length) return false;
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] !== areaMask.data[i]) return false;
    }
    return true;
  }

  forEach(fn) {
    for (let i = 0; i < this.size; i++) if (this.get(i)) fn(...this.coords(i), i, this);
  }
}
