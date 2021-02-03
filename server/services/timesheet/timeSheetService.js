const { getRepository } = require("../../framework/datastore/dbConnectionManager");
const TimeSheetModel = require("./model/timeSheetModel");

class TimeSheetService {
  repository = null;
  constructor(repository) {
    this.repository = repository || getRepository(TimeSheetModel);
  }
  async getTimesheets(params) {
    let timeSheets = await this.repository.find(params);
    //console.log(timeSheets);
    return timeSheets;
  }
}
module.exports = TimeSheetService;
