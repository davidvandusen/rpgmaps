module.exports = function makeActionCreator(type, ...payloadProps) {
  return function (...args) {
    let action = {type};
    if (payloadProps.length) {
      action.payload = {};
      payloadProps.forEach((propName, index) => {
        action.payload[payloadProps[index]] = args[index]
      });
    }
    return action;
  };
};
