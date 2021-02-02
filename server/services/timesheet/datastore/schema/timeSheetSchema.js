const DBEntitySchema = require("../../../../framework/datastore/dbEntitySchema");
const Timesheet = require("../../model/timeSheet");

module.exports = new DBEntitySchema({
  name: "TimeSheet",
  target: TimeSheet,
  tableName: "TimeSheet",
  columns: {
    timeSheetId: {
      primary: true,
      type: "int",
      generated: true,
      unsigned: true,
    },
    userId: { type: "int" },
    date: { type: "date" },
    activity: { type: "varchar" },
    hours: { type: "float" },
  },
});
