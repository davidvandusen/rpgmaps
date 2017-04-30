function save(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function load(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch (err) {
    console.error(`failed to parse ${key} in localStorage as JSON`);
  }
}

module.exports = {
  save,
  load
};
