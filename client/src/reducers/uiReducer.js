const createReducer = require('./createReducer');

module.exports = createReducer({}, {
  TOGGLE_MENU: (state, action) => ({
    ...state,
    menuOpen: action.payload.menu === state.menuOpen ? undefined : action.payload.menu
  })
});
