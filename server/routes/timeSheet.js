const express = require("express");
const TimeSheetService = require("../services/timeSheet/timeSheetService");
const router = express.Router();

const routerErrorHandler = require("./routerErrorHandler");

/**
 * @swagger
 * tags:
 *   name: TimeSheet
 *   description: REST services for Timesheet
 */

/**
 * @swagger
 *
 *  /timesheet:
 *    get:
 *      summary: Retrieve user timesheets
 *      tags: [TimeSheet]
 *      parameters:
 *       - name: userId
 *         in: query
 *         required: false
 *         type: string
 *
 *       - name: fromDate
 *         in: query
 *         required: true
 *         type: string
 *         description: YYYY-MM-DD format
 *       - name: toDate
 *         in: path
 *         required: true
 *         type: string
 *         description: YYYY-MM-DD format
 *      responses:
 *        "200":
 *          description: Timesheets matching user,date range
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TimeSheet'
 */
router.get(
  "/",
  routerErrorHandler(async function (req, res, next) {
    let result = await new TimeSheetService().search(req.query);
    res.status(200).json(result);
  })
);

/**
 * @swagger
 *
 *  /timesheet:
 *    post:
 *      summary: Create Timesheet
 *      tags: [TimeSheet]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TimeSheet'
 *      responses:
 *        "200":
 *          description: The created timesheet
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Timesheet'
 */
router.post(
  "/",
  routerErrorHandler(async function (req, res, next) {
    let service = new TimeSheetService();
    let result = await service.create(req.body);
    res.status(200).json(result);
  })
);

/**
 * @swagger
 *
 *  /timesheet:
 *    put:
 *      summary: Update Timesheet
 *      tags: [TimeSheet]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TimeSheet'
 *      responses:
 *        "200":
 *          description: Updated timesheet
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Timesheet'
 *
 */
router.put(
  "/",
  routerErrorHandler(async function (req, res, next) {
    let service = new TimeSheetService();
    let result = await service.update(req.body);
    res.status(200).json(result);
  })
);

/**
 * @swagger
 *
 *  /timesheet:
 *    delete:
 *      summary: Retrieve user timesheets
 *      tags: [TimeSheet]
 *      parameters:
 *       - name: timesheetId
 *         in: path
 *         required: false
 *         type: string
 *      responses:
 *        "200":
 *          description: Timesheets matching user,date range
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TimeSheet'
 */
router.delete(
  "/:timeSheetId",
  routerErrorHandler(async function (req, res, next) {
    let service = new TimeSheetService();
    let result = await service.delete(req.params.timeSheetId);
    res.status(200).json(result);
  })
);
module.exports = router;
