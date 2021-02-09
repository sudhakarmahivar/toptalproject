const moment = require("moment");
const Model = require("../../../framework/datastore/model");
const { utils, errorMessages } = require("../../../framework/framework");
const ValidationError = require("../../../framework/errors/validationError");

/**
 * @swagger
 *  components:
 *    schemas:
 *      TimeSheet:
 *        type: object
 *        required:
 *          - activity
 *          - hours
 *          - date
 *        properties:
 *          activity:
 *            type: string
 *            description: Your activity
 *          date:
 *            type: string
 *            description: Activity date, in YYYY-MM-DD format
 *          hours:
 *            type: number
 *            description: Less than or equal to 24
 *        example:
 *           activity: Fishing
 *           hours: 4
 *           date: 2021-02-02
 */

module.exports = class TimeSheetModel extends (
  Model
) {
  timeSheetId;
  userId;
  date;
  activity;
  hours;
};
