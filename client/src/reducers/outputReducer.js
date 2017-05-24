const createReducer = require('./createReducer');

module.exports = createReducer({
  quality: 10,
  randomnessSeed: ''
}, {
  SET_OUTPUT_QUALITY: (state, {payload}) => ({
    ...state,
    quality: payload.quality
  }),
  SET_OUTPUT_RANDOMNESS_SEED: (state, {payload}) => ({
    ...state,
    randomnessSeed: payload.randomnessSeed
  })
});
