const { logger, UserContext, utils } = require("../../framework/framework");
const { getRepository } = require("../../framework/datastore/dbConnectionManager");
const TimeSheetModel = require("./model/timeSheetModel");

class TimeSheetService {
  repository = null;
  constructor(repository, userContext) {
    this.repository = repository || getRepository(TimeSheetModel);
  }
  async getTimesheets(searchParams) {
    let timeSheets = await this.repository.find({ ...searchParams });
    logger.debug("timeSheetService", UserContext.get());
    //console.log(timeSheets);
    return timeSheets;
  }
  async addTimeSheet(timeSheetModel) {
    //TODO: DTO Validations and other rules
    const { userId } = UserContext.get();
    timeSheetModel.userId = userId;
    timeSheetModel.date = utils.getFormattedDate();
    timeSheetModel.createdBy = userId;
    timeSheetModel = await this.repository.save(timeSheetModel);

    //console.log(timeSheets);
    return timeSheetModel;
  }
}
module.exports = TimeSheetService;
