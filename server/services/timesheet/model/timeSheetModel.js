const moment = require("moment");
const Model = require("../../../framework/datastore/Model");

module.exports = class TimeSheetModel extends (
  Model
) {
  timeSheetId;
  userId;
  date = moment().format("YYYY-MM-DD");
  activity;
  hours;
};
