const validators = {};

validators.validatePassword = function (input) {
  let passRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/;
  return input.match(passRegex);
};

module.exports = validators;
