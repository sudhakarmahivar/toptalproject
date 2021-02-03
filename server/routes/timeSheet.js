var express = require("express");
const TimesheetService = require("../services/timeSheet/timeSheetService");
var router = express.Router();

/**
 * Timesheet CRUD routes
 */
router.get("/", async function (req, res, next) {
  let result = await new TimesheetService().getTimesheets(req.params);
  console.log(result);
  res.status(200).json(result);
  next();
});

module.exports = router;
