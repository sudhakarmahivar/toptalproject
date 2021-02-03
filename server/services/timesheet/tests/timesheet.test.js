var TimeSheetService = require("../timeSheetService");

test("test getTimeSheets invokes repository find with sent parameters and returns result", async () => {
  let mockTimeSheets = [{ timeSheetId: 1 }];
  let mockRepository = {
    find: jest.fn((params) => {
      return mockTimeSheets;
    }),
  };
  const service = new TimeSheetService(mockRepository);
  let findParams = { timeSheetId: 1 };
  const result = await service.getTimesheets(findParams);
  //verify it invokes find method with right params
  expect(mockRepository.find.mock.calls.length).toEqual(1);
  expect(mockRepository.find.mock.calls[0][0]).toEqual(findParams);
  //verify it returns result
  expect(result).not.toBeNull();
  expect(result.length).toEqual(mockTimeSheets.length);
  expect(result[0]).toEqual(mockTimeSheets[0]);
});
