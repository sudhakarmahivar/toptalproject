const { Between } = require("typeorm");

const { UserContext, utils, errorMessages } = require("../../framework/framework");
const { getRepository } = require("../../framework/datastore/dbConnectionManager");
const TimeSheetModel = require("./model/timeSheetModel");
const roles = require("../common/roles");
const ValidationError = require("../../framework/errors/validationError");
const AuthorizationError = require("../../framework/errors/authorizationError");
const ResourceNotFoundError = require("../../framework/errors/ResourceNotFoundError");
/**
 * Timesheet business functionality implemented here
 * Service created independant calling mechanism ( http, message triggered etc)
 * No reference of http verb should be made
 */
class TimeSheetService {
  repository = null;
  userContext = null;

  constructor(repository, userContext) {
    this.repository = repository || getRepository(TimeSheetModel);
    this.userContext = userContext || UserContext.get();
  }
  //
  // Helper Methods
  //
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
  //Get active timesheets based on time sheet attributes
  async getTimesheets(timeSheetModel) {
    //if query string passed use the same, else get alltimesheets for the user Id sent
    let timeSheets = await this.repository.find({ deleted: false, ...timeSheetModel });
    return timeSheets;
  }

  //
  // Service End Points
  //
  async search(timeSheetSearchModel) {
    //create where clause with passed search parameters
    const { fromDate, toDate, userId } = timeSheetSearchModel;
    const whereClause = {};
    if (fromDate && toDate) {
      whereClause.date = Between(fromDate, toDate);
    }
    //If admin allow him/her to query other users
    if (userId && this.userContext.role === roles.admin) {
      whereClause.userId = userId;
    }
    //if user not set, set it to logged in user
    if (!whereClause.userId) whereClause.userId = this.userContext.userId;
    whereClause.deleted = false;
    return await this.repository.find(whereClause);
  }

  async create(timeSheetModel) {
    const { userId, role } = this.userContext;
    //if admin and userId sent, use the same. In all other cases overwrite with logged in user
    if (role !== roles.admin || !timeSheetModel.userId) {
      timeSheetModel.userId = userId;
    }
    timeSheetModel.deleted = false;
    timeSheetModel.createdBy = userId;
    timeSheetModel.timeSheetId = null;
    this.validateModel(timeSheetModel);

    //Validate day total doesn't exceed
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
    if (dbTimeSheet.userId !== userId && role !== roles.admin) {
      throw new AuthorizationError(errorMessages.unauthorizedForTimeSheet);
    }

    timeSheetModel.userId = dbTimeSheet.userId;
    timeSheetModel.updatedBy = userId;
    this.validateModel(timeSheetModel);
    await this.validateDayTotal(timeSheetModel);
    timeSheetModel = await this.repository.save(timeSheetModel);
    return timeSheetModel;
  }
  async delete(timeSheetId) {
    const { role, userId } = this.userContext;
    //validate if timesheet already exists
    var dbTimeSheets = await this.getTimesheets({ timeSheetId });
    if (dbTimeSheets.length === 0) {
      //no matching time sheet
      throw new ResourceNotFoundError("Timesheet not found");
    }
    let dbTimeSheet = dbTimeSheets[0];
    if (dbTimeSheet.userId !== userId && role !== roles.admin) {
      throw new AuthorizationError(errorMessages.unauthorizedForTimeSheet);
    }
    dbTimeSheet.deleted = true;
    dbTimeSheet = await this.repository.save(dbTimeSheet);
    return dbTimeSheet;
  }
}
module.exports = TimeSheetService;
