const makeActionCreator = require('./makeActionCreator');

const createToken = makeActionCreator('CREATE_TOKEN', 'name', 'description', 'x', 'y');
exports.createToken = () => (dispatch, getState) => {
  const state = getState();
  const x = state.settings.input.width / 2;
  const y = state.settings.input.height / 2;
  dispatch(createToken('', '', x, y));
};

const deleteToken = makeActionCreator('DELETE_TOKEN', '_id');
exports.deleteToken = deleteToken;

const updateToken = makeActionCreator('UPDATE_TOKEN', '_id', 'name', 'description', 'x', 'y');
exports.updateToken = updateToken;

const moveToken = (_id, x, y) => (dispatch, getState) => {
  const token = getState().settings.tokens.find(token => token._id === _id);
  dispatch(updateToken(_id, token.name, token.description, x, y));
};
exports.moveToken = moveToken;

const nameToken = (_id, name) => (dispatch, getState) => {
  const token = getState().settings.tokens.find(token => token._id === _id);
  dispatch(updateToken(_id, name, token.description, token.x, token.y));
};
exports.nameToken = nameToken;

const describeToken = (_id, description) => (dispatch, getState) => {
  const token = getState().settings.tokens.find(token => token._id === _id);
  dispatch(updateToken(_id, token.name, description, token.x, token.y));
};
exports.describeToken = describeToken;
