var TimesheetService = require("../timesheet");

test("test if service returns", async () => {
  const service = new TimesheetService();
  const result = await service.getTimesheet();
  expect(result).not.toBeNull();
  expect(result.status).toEqual("ok");
});
