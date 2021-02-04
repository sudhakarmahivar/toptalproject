var express = require("express");
const TimesheetService = require("../services/timeSheet/timeSheetService");
var router = express.Router();
const { logger } = require("../framework/framework");

const TimeSheetService = require("../services/timeSheet/timeSheetService");
/**
 * Timesheet CRUD routes
 */
router.get("/", async function (req, res, next) {
  try {
    let result = await new TimesheetService().getTimesheets(req.body);
    res.status(200).json(result);
    next && next();
  } catch (err) {
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    let service = new TimeSheetService();
    let result = await service.create(req.body);
    res.status(200).json(result);
    next && next();
  } catch (err) {
    next(err);
  }
});
router.put("/", async function (req, res, next) {
  try {
    let service = new TimeSheetService();
    let result = await service.update(req.body);
    res.status(200).json(result);
    next && next();
  } catch (err) {
    next(err);
  }
});
module.exports = router;
