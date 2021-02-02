const Model = require("../../../framework/datastore/Model");

module.exports = class Timesheet extends (
  Model
) {
  timeSheetId;
  userId;
  date = moment().format("YYYY-MM-DD");
  activity;
  hours;
};
