const { logger, UserContext, utils, errorMessages } = require("../../framework/framework");
const { getRepository } = require("../../framework/datastore/dbConnectionManager");
const TimeSheetModel = require("./model/timeSheetModel");
const roles = require("../user/roles");
const ValidationError = require("../../framework/errors/validationError");
const errorCodes = require("../../framework/errors/errorCodes");
const AuthenticationError = require("../../framework/errors/authenticationError");
const ResourceNotFoundError = require("../../framework/errors/ResourceNotFoundError");
class TimeSheetService {
  repository = null;
  userContext = null;

  validateModel(timeSheet) {
    if (!timeSheet.date || !utils.isValidPastDate(timeSheet.date)) {
      //not a valid date
      throw new ValidationError(errorMessages.validDateRequired);
    }

    if (!timeSheet.hours || timeSheet.hours > 24) {
      //not a valid date
      throw new ValidationError(errorMessages.validHoursRequired);
    }
    if (!timeSheet.activity) {
      //not a valid date
      throw new ValidationError(errorMessages.validActivityRequired);
    }
  }
  async validateDayTotal(timeSheetModel) {
    const dayTimeSheets = await this.getTimesheets({ date: timeSheetModel.date, userId: timeSheetModel.userId });
    //get total of other rows
    //In case of update, exclude current row being updated
    let total = dayTimeSheets.reduce((v, ts) => (ts.timeSheetId === timeSheetModel.timeSheetId ? v : v + ts.hours), 0);
    total += timeSheetModel.hours;

    if (total > 24) {
      throw new ValidationError(errorMessages.TotalDayHoursExceedLimit);
    }
  }

  constructor(repository, userContext) {
    this.repository = repository || getRepository(TimeSheetModel);
    this.userContext = userContext || UserContext.get();
  }
  //Get active timesheets based on time sheet attributes
  async getTimesheets(timeSheetModel) {
    let timeSheets = await this.repository.find({ deleted: false, ...timeSheetModel });
    return timeSheets;
  }
  async create(timeSheetModel) {
    //TODO: DTO Validations and other rules
    const { userId, role } = this.userContext;
    //if admin and userId sent, use the same. In all other cases overwrite with logged in user
    if (role !== roles.admin || !timeSheetModel.userId) {
      timeSheetModel.userId = userId;
    }
    timeSheetModel.deleted = false;
    timeSheetModel.createdBy = userId;
    timeSheetModel.timeSheetId = null;
    this.validateModel(timeSheetModel);

    //Validate day total doesnt exceed
    await this.validateDayTotal(timeSheetModel);

    timeSheetModel = await this.repository.save(timeSheetModel);
    return timeSheetModel;
  }

  async update(timeSheetModel) {
    const { role, userId } = this.userContext;
    //validate if timesheet already exists
    var dbTimeSheets = await this.getTimesheets({ timeSheetId: timeSheetModel.timeSheetId });
    if (dbTimeSheets.length === 0) {
      //no matching time sheet
      throw new ResourceNotFoundError("Timesheet not found");
    }

    const dbTimeSheet = dbTimeSheets[0];
    if (dbTimeSheet.userId !== timeSheetModel.userId && role !== roles.admin) {
      throw new AuthenticationError("You are not authorized for the timesheet");
    }

    timeSheetModel.userId = dbTimeSheet.userId;
    timeSheetModel.updatedBy = userId;
    this.validateModel(timeSheetModel);
    await this.validateDayTotal(timeSheetModel);
    timeSheetModel = await this.repository.save(timeSheetModel);
    //console.log(timeSheets);
    return timeSheetModel;
  }
}
module.exports = TimeSheetService;
