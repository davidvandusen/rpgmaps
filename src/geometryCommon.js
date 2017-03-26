function pointInCircle(x, y, cx, cy, r) {
  return Math.sqrt(Math.pow(Math.abs(x - cx), 2) + Math.pow(Math.abs(y - cy), 2)) <= r;
}

export {
  pointInCircle
};
