const moment = require("moment");
const Model = require("../../../framework/datastore/model");
const { utils, errorMessages } = require("../../../framework/framework");
const ValidationError = require("../../../framework/errors/validationError");

module.exports = class UserModel extends (
  Model
) {
  userId;
  userName;
  role;
  password;
  name;
  workingHoursPerDay;
};
