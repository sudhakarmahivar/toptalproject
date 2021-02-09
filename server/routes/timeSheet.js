const express = require("express");
const router = express.Router();

const TimesheetService = require("../services/timeSheet/timeSheetService");
const routerErrorHandler = require("./routerErrorHandler");
/**
 * Timesheet CRUD routes
 */
router.get(
  "/",
  routerErrorHandler(async function (req, res, next) {
    let result = await new TimesheetService().search(req.query);
    res.status(200).json(result);
  })
);

router.post(
  "/",
  routerErrorHandler(async function (req, res, next) {
    let service = new TimeSheetService();
    let result = await service.create(req.body);
    res.status(200).json(result);
  })
);
router.put(
  "/",
  routerErrorHandler(async function (req, res, next) {
    let service = new TimeSheetService();
    let result = await service.update(req.body);
    res.status(200).json(result);
  })
);
router.delete(
  "/:timeSheetId",
  routerErrorHandler(async function (req, res, next) {
    let service = new TimeSheetService();
    let result = await service.delete(req.params.timeSheetId);
    res.status(200).json(result);
  })
);
module.exports = router;
