const moment = require("moment");
const Model = require("../../../framework/datastore/model");
const { utils, errorMessages } = require("../../../framework/framework");
const ValidationError = require("../../../framework/errors/validationError");

module.exports = class TimeSheetModel extends (
  Model
) {
  timeSheetId;
  userId;
  date;
  activity;
  hours;
};
