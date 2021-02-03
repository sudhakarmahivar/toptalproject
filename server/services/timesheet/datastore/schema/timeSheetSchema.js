const DBEntitySchema = require("../../../../framework/datastore/dbEntitySchema");
const TimeSheetModel = require("../../model/timeSheetModel");

module.exports = new DBEntitySchema({
  name: "TimeSheet",
  target: TimeSheetModel,
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
