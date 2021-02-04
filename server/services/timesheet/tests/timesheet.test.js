const errorCodes = require("../../../framework/errors/errorCodes");
const { errorMessages } = require("../../../framework/framework");
const roles = require("../../user/roles");
var TimeSheetService = require("../timeSheetService");

//Create mock repo
//capped to 3 hours
let mockTimeSheets = [
  { timeSheetId: 1, hours: 1, date: "2009-01-01", userId: 12345 },
  { timeSheetId: 2, hours: 2, date: "2009-01-01", userId: 12345 },
];
let mockRepository = {
  find: jest.fn((params) => {
    return mockTimeSheets;
  }),
  save: jest.fn((model) => ({ ...model, timeSheetId: Math.floor(Math.random() * 10000 + 1) })),
};
let mockUserId = 12345,
  mockAdminId = 98765,
  mockManagerId = 56789;
let mockUsers = [
  {
    userId: mockUserId,
    role: roles.user,
  },
  {
    userId: mockManagerId,
    role: roles.manager,
  },
  {
    userId: mockAdminId,
    role: roles.admin,
  },
];
let getMockUserContext = (role) => mockUsers.find((m) => m.role === role);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("timesheet - getTimeSheets", () => {
  test("test getTimeSheets invokes repository find with sent parameters and returns result", async () => {
    const service = new TimeSheetService(mockRepository);
    let findParams = { timeSheetId: 1 };
    const result = await service.getTimesheets(findParams);
    //verify it invokes find method with right params
    expect(mockRepository.find.mock.calls.length).toEqual(1);
    expect(mockRepository.find.mock.calls[0][0].timeSheetId).toEqual(findParams.timeSheetId);
    //verify it returns result
    expect(result).not.toBeNull();
    expect(result.length).toEqual(mockTimeSheets.length);
    expect(result[0]).toEqual(mockTimeSheets[0]);
  });
});

var runServiceTest = async (method, role, modelPatch, expectedErrorCode, expectedErrorMessage) => {
  const service = new TimeSheetService(mockRepository, getMockUserContext(role));
  try {
    const result = await service[method]({
      activity: "test",
      date: "2010-01-01",
      hours: 5,
      ...modelPatch,
    });
    if (!expectedErrorCode) return result; //no expected error code. If we're here then we succeeded
  } catch (err) {
    expect(err.errorCode).toEqual(expectedErrorCode);
    if (expectedErrorMessage) expect(err.error).toEqual(expectedErrorMessage);
  }
};
var runServiceCreateTest = async (role, modelPatch, expectedErrorCode, expectedErrorMessage) => {
  return await runServiceTest("create", role, modelPatch, expectedErrorCode, expectedErrorMessage);
};
var runServiceUpdateTest = async (role, modelPatch, expectedErrorCode, expectedErrorMessage) => {
  return await runServiceTest("update", role, modelPatch, expectedErrorCode, expectedErrorMessage);
};
describe("Create timeSheet tests", () => {
  test("create timesheet fails with invalid date value/date in future", async () => {
    await runServiceCreateTest(roles.user, { date: null }, errorCodes.validationError, errorMessages.validDateRequired);
    await runServiceCreateTest(
      roles.user,
      { date: "2050-01-01" },
      errorCodes.validationError,
      errorMessages.validDateRequired
    );
    await runServiceCreateTest(roles.user, { date: "2020-01-01" }); //should succeed
  });

  test("create timesheet fails when activity missing", async () => {
    await runServiceCreateTest(
      roles.user,
      { activity: null },
      errorCodes.validationError,
      errorMessages.validActivityRequired
    );
    await runServiceCreateTest(roles.user, { activity: "xxxx" }); //should succeed
  });
  test("create timesheet fails when hours is invalid/missing", async () => {
    await runServiceCreateTest(
      roles.user,
      { hours: null },
      errorCodes.validationError,
      errorMessages.validHoursRequired
    );
    await runServiceCreateTest(roles.user, { hours: 0 }, errorCodes.validationError, errorMessages.validHoursRequired);
    await runServiceCreateTest(
      roles.user,
      { hours: 24.1 },
      errorCodes.validationError,
      errorMessages.validHoursRequired
    );
    await runServiceCreateTest(roles.user, { hours: 2 }); //success
  });
  test("create timesheet, saves successfully when valid values sent", async () => {
    const modelPatch = { activity: "success-activity" };
    const result = await runServiceCreateTest(roles.user, modelPatch); //success
    expect(result).not.toBeNull();

    //validate all fields are populated properly
    expect(result.activity).toEqual(modelPatch.activity);
    expect(result.deleted).toEqual(false);
  });
  test("create timesheet, saved againt user logged in for users, manager roles", async () => {
    let result = await runServiceCreateTest(roles.user, {}); //success
    expect(result.userId).toEqual(mockUserId);
  });
  test("create timesheet, saves against logged in userId for users, manager roles, ignoring user ids even if sent in request", async () => {
    let result = await runServiceCreateTest(roles.user, { userId: "some-other-user" }); //override with usercontext
    expect(result.userId).toEqual(mockUserId);
    result = await runServiceCreateTest(roles.manager, { userId: "some-other-user-y" });
    expect(result.userId).toEqual(mockManagerId);
  });
  test("create timesheet, for admin role, allows saving against other userIds", async () => {
    const result = await runServiceCreateTest(roles.admin, { userId: "some-other-user" });
    //uses passed in user-id
    expect(result.userId).toEqual("some-other-user");
  });
  test("timesheet total hours should not exceed 24", async () => {
    //mock rows has hours clocked for 3 hours already.
    let result = await runServiceCreateTest(roles.user, { hours: 21 }); //should succeed

    //should fail since it exceeds 24 hours
    result = await runServiceCreateTest(
      roles.user,
      { hours: 22 },
      errorCodes.validationError,
      errorMessages.TotalDayHoursExceedLimit
    );
  });
});
describe("Update timeSheet tests", () => {
  test("update timesheet throws auth error when updating different user record  ( as a non-admin)", async () => {
    await runServiceUpdateTest(
      roles.user,
      { timeSheetId: 1, date: null, userId: 99999 },
      errorCodes.authenticationError
    );
  });
  test("as admin, allow update of others timesheets", async () => {
    await runServiceUpdateTest(roles.admin, { timeSheetId: 1, userId: mockUserId }); //should succeed
  });
  test("on update, ensure day total doesnt exceed 24 hours", async () => {
    await runServiceUpdateTest(
      roles.user,
      { timeSheetId: 1, hours: 23.1, userId: mockUserId },
      errorCodes.validationError
    ); //should throw error
  });
  test("should fail if timesheet doesnt exist", async () => {
    let mockRepository = {
      find: jest.fn((params) => {
        return [];
      }),
    };
    const service = new TimeSheetService(mockRepository, getMockUserContext(roles.user));
    try {
      const result = await service.update({
        timeSheetId: 1234,
        hours: 20,
      });
    } catch (err) {
      expect(err.errorCode).toEqual(errorCodes.resourceNotFoundError);
    }
  });
});
