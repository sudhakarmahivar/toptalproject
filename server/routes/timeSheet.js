var express = require("express");
const TimesheetService = require("../services/timeSheet/timeSheetService");
var router = express.Router();
const { logger } = require("../framework/framework");

const TimeSheetService = require("../services/timeSheet/timeSheetService");
/**
 * Timesheet CRUD routes
 */
router.get("/", async function (req, res, next) {
  let result = await new TimesheetService().getTimesheets(req.body);
  res.status(200).json(result);
  next();
});

router.post("/", async function (req, res, next) {
  logger.debug(req.body);
  let service = new TimeSheetService();
  let result = await service.addTimeSheet(req.body);
  res.status(200).json(result);
  next();
});

module.exports = router;
