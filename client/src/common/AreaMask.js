const base64 = require('base64-js');

function countSetBits(n) {
  let c;
  for (c = 0; n; n = n & (n - 1)) c++;
  return c;
}

class AreaMask {
  static fromJSON(obj) {
    const mask = new AreaMask(obj.size, obj.width);
    const byteWidth = Math.ceil(obj.width / 8);
    const compressedWidth = obj.maxX - obj.minX + 1;
    const compressedData = base64.toByteArray(obj.data);
    for (let y = obj.minY; y <= obj.maxY; y++) {
      for (let x = obj.minX; x <= obj.maxX; x++) {
        mask.data[y * byteWidth + x] = compressedData[(y - obj.minY) * compressedWidth + (x - obj.minX)];
      }
    }
    let n = 0;
    for (let i = 0; i < compressedData.length; i++) {
      n += countSetBits(mask.data[i]);
    }
    mask.n = n;
    return mask;
  }

  constructor(size, width) {
    this.size = size;
    this.width = width;
    this.height = Math.ceil(this.size / this.width);
    this.data = new Uint8Array(Math.ceil(size / 8));
    this.n = 0;
  }

  toJSON() {
    let minX;
    let maxX;
    let minY;
    let maxY;
    const byteWidth = Math.ceil(this.width / 8);
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] !== 0) {
        const x = i % byteWidth;
        const y = Math.floor(i / byteWidth);
        if (minX === undefined || minX > x) minX = x;
        if (minY === undefined || minY > y) minY = y;
        if (maxX === undefined || maxX < x) maxX = x;
        if (maxY === undefined || maxY < y) maxY = y;
      }
    }
    let compressedData;
    if (minX === 0 && maxX === byteWidth - 1 && minY === 0 && maxY === this.height - 1) {
      compressedData = this.data;
    } else {
      const compressedWidth = maxX - minX + 1;
      const compressedHeight = maxY - minY + 1;
      compressedData = new Uint8Array(compressedWidth * compressedHeight);
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          compressedData[(y - minY) * compressedWidth + (x - minX)] = this.data[y * byteWidth + x];
        }
      }
    }
    return {
      size: this.size,
      width: this.width,
      minX,
      maxX,
      minY,
      maxY,
      data: base64.fromByteArray(compressedData)
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

module.exports = AreaMask;
