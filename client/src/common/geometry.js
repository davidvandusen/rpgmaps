const AreaMask = require('./AreaMask');

function pointInCircle(x, y, cx, cy, r) {
  return distance(x, y, cx, cy) <= r;
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2));
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
  const points = [];
  if (!pos) return points;
  do {
    const last = points[points.length - 1];
    points.push(pos);
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
  return points;
}

function getOffsetMask(mask, amount) {
  const width = mask.width;
  let oldMask = mask;
  let newMask;
  for (let n = 0; n < Math.abs(amount); n++) {
    newMask = new AreaMask(oldMask.size, width);
    for (let i = 0; i < oldMask.size; i++) {
      const points = [
        oldMask.get(i - width - 1), oldMask.get(i - width), oldMask.get(i - width + 1),
        oldMask.get(i - 1), oldMask.get(i), oldMask.get(i + 1),
        oldMask.get(i + width - 1), oldMask.get(i + width), oldMask.get(i + width + 1),
      ];
      if (points.includes(true)) {
        if (points.includes(false)) {
          newMask.set(i, amount > 0);
        } else {
          newMask.set(i, true);
        }
      } else {
        newMask.set(i, false);
      }
    }
    if (newMask.empty() && amount < 0 || newMask.full() && amount > 0) return [newMask];
    else oldMask = newMask;
  }
  // FIXME the dog bone problem can split the mask into multiple contiguous areas
  // so it needs to be separated into multiple masks
  return [newMask];
}

function smoothPolygon(points, amount) {
  const amt = Math.floor(amount);
  const n = amt * 2;
  const out = [];
  for (let i = 0; i < points.length; i++) {
    let sx = 0;
    let sy = 0;
    for (let p = i - amt; p < i + amt; p++) {
      const index = p < 0 ? points.length + p : p >= points.length ? p - points.length : p;
      sx += points[index][0];
      sy += points[index][1];
    }
    out.push([sx / n, sy / n]);
  }
  return out;
}

function west(point1, point2, x, y) {
  if (point1[1] > point2[1]) {
    let tmp = point1;
    point1 = point2;
    point2 = tmp;
  }
  if (y <= point1[1] || y > point2[1] || x >= point1[0] && x >= point2[0]) return false;
  if (x < point1[0] && x < point2[0]) return true;
  return (y - point1[1]) / (x - point1[0]) > (point2[1] - point1[1]) / (point2[0] - point1[0]);
}

function contains(points, x, y) {
  let count = 0;
  for (let pointIndex = 0; pointIndex < points.length; pointIndex++) {
    const point1 = points[pointIndex];
    const point2 = points[(pointIndex + 1) % points.length];
    if (west(point1, point2, x, y)) count++;
  }
  return !!(count % 2);
}

module.exports = {
  contains,
  pointInCircle,
  distance,
  smoothPolygon,
  outlineMask,
  getOffsetMask
};
