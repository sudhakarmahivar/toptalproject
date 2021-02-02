const { getRepository } = require("../../framework/datastore/dbConnectionManager");
const Timesheet = require("./model/timeSheet");

class TimesheetService {
  repository = null;
  constructor(repository) {
    if (repository) this.repository = repository;
    else repository = getRepository(Timesheet);
  }
  async getTimesheet(params) {
    return { status: "ok" };
  }
}
module.exports = TimesheetService;
