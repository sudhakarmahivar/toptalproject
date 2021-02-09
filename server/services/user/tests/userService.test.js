const config = require("../../../config");
const errorCodes = require("../../../framework/errors/errorCodes");
const { errorMessages } = require("../../../framework/framework");
const roles = require("../../common/roles");
const UserService = require("../userService");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("UserService - Create User tests", () => {
  test("should validate userName for length and alphanumeric rule", async () => {
    let userService = new UserService(
      { findOne: jest.fn((params) => null), save: jest.fn((model) => ({ ...model, userId: 2000 })) },
      {
        userId: 1000,
        role: roles.user,
      }
    );
    try {
      await userService.create({ userName: "xyz", password: "Hash@123" });
    } catch (err) {
      expect(err.errorCode).toEqual(errorCodes.validationError);
      expect(err.message).toEqual(errorMessages.userNameError);
    }
    //should succeed
    let result = await userService.create({
      name: "Sudhakar",
      email: "sudhakar@test.com",
      userName: "sudhakarnraju",
      password: "Hash@123",
    });
    expect(result).not.toBeNull();
    expect(result.userId).toEqual(2000);
  });
  let runPasswordtest = async (userService, password, success) => {
    try {
      let result = await userService.create({
        userName: "sudhakarnraju",
        name: "someuser",
        email: "some@email.com",
        password,
      });
      if (!success) {
        //test case expected to fail, hence you should be here
        fail("Expected to fail for password:" + password);
      }
      expect(result).not.toBeNull();
    } catch (err) {
      if (success) {
        fail("Expected to pass for password:" + password);
      }
      expect(err.errorCode).toEqual(errorCodes.validationError);
      expect(err.message).toEqual(errorMessages.passwordRulesError);
    }
  };

  test("should validate password rules", async () => {
    let userService = new UserService(
      { findOne: jest.fn((params) => null), save: jest.fn((model) => ({ ...model, userId: 2000 })) },
      {
        userId: 1000,
        role: roles.user,
      }
    );
    runPasswordtest(userService, "hello", false);
    runPasswordtest(userService, "hello123", false);
    runPasswordtest(userService, "hello@123", false);
    runPasswordtest(userService, "Hello@123", true);
  });
  let fieldValidationTest = async (field, fieldValue, shouldFail = true, savedValue) => {
    let userService = new UserService(
      { findOne: jest.fn((params) => null), save: jest.fn((model) => ({ ...model, userId: 2000 })) },
      {
        userId: 1000,
        role: roles.user,
      }
    );
    try {
      const payload = {
        name: "Valid User",
        email: "test@test.com",
        userName: "sudhakarnraju",
        password: "Hash@123",
        workingHoursPerDay: 1,
      };
      payload[field] = fieldValue;
      let result = await userService.create(payload);
      if (shouldFail) fail("Expected test to fail for " + field + ":" + fieldValue);
      if (!shouldFail) expect(result[field]).toEqual(savedValue || fieldValue);
      return result;
    } catch (err) {
      if (!shouldFail) fail("Not expecting exception for " + field + ":" + fieldValue);
      expect(err.errorCode).toBe(errorCodes.validationError);
      expect(err.message).toBe(errorMessages[`${field}Error`]);
    }
  };
  test("should validate Name rules", async () => {
    await fieldValidationTest("name", "");
    await fieldValidationTest("name", null);
    await fieldValidationTest("name", "Name with numbers123");
    await fieldValidationTest("name", "This is very long name very long to exceed fifty char limit");
    await fieldValidationTest("name", "Good Name", false); //Should not fail
  });
  test("should validate email rules", async () => {
    await fieldValidationTest("email", "");
    await fieldValidationTest("email", null);
    await fieldValidationTest("email", "invalidEmail");
    await fieldValidationTest("email", "valid@email.com", false); //should succeed
  });
  test("should validate workingHours field", async () => {
    //when none sent, it should default
    await fieldValidationTest("workingHoursPerDay", null, false, config.workingHoursPerDayDefault);
    await fieldValidationTest("workingHoursPerDay", undefined, false, config.workingHoursPerDayDefault);
    //when value sent, use that explicitly
    await fieldValidationTest("workingHoursPerDay", 5, false);
    await fieldValidationTest("workingHoursPerDay", -1); //should fail
    await fieldValidationTest("workingHoursPerDay", 25); //should fail

    //invalid values throw error
  });
  test("should save user when username and password are good, with role=user", async () => {
    let userService = new UserService(
      { findOne: jest.fn((params) => null), save: jest.fn((model) => ({ ...model, userId: 2000 })) },
      {
        userId: 1000,
        role: roles.user,
      }
    );
    //should succeed
    let result = await userService.create({
      name: "testuser",
      email: "test@test.com",
      userName: "sudhakarnraju",
      password: "Hash@123",
    });
    expect(result).not.toBeNull();
    expect(result.userId).toEqual(2000);
    expect(result.role).toEqual(roles.user);
  });

  test("should assign user to role as in payload, when invoked by admin/manager", async () => {
    let userService = new UserService(
      { findOne: jest.fn((params) => null), save: jest.fn((model) => ({ ...model, userId: 2000 })) },
      {
        userId: 1000,
        role: roles.manager,
      }
    );
    //should succeed
    let result = await userService.create({
      name: "new name",
      email: "some@some.com",
      userName: "sudhakarnraju",
      password: "Hash@123",
      role: roles.manager,
    });
    expect(result).not.toBeNull();
    expect(result.userId).toEqual(2000);
    expect(result.role).toEqual(roles.manager);
  });
});

describe("UserService - Update User tests", () => {
  test("should allow password change for self, satisfying password rules", async () => {
    let dbRecord = {
      userId: 1000,
      name: "somename",
      email: "some@mail.com",
      userName: "testuser",
      password: "x",
    };
    let mockRepository = {
      findOne: jest.fn((params) => dbRecord),
      save: jest.fn((model) => ({ ...model, userId: 2000 })),
    };
    let userService = new UserService(mockRepository, {
      userId: 1000,
      role: roles.user,
    });
    const password = "Hash@123";
    await userService.update({
      userId: 1000,
      userName: "sudhakarnraju",
      password,
      name: "new name",
      email: "some@some.com",
    });
    expect(mockRepository.save).toBeCalled();
    const userModel = mockRepository.save.mock.calls[0][0];
    expect(userModel.password).toEqual(password);
  });
  test("should retain role from current db record", async () => {
    let dbRecord = {
      userId: 1000,
      userName: "testuser",
      password: "x",
      role: roles.user,
      name: "new name",
      email: "some@some.com",
    };
    let mockRepository = {
      findOne: jest.fn((params) => dbRecord),
      save: jest.fn((model) => ({ ...model, userId: 2000 })),
    };
    let userService = new UserService(mockRepository, {
      userId: 1000,
      role: roles.user,
    });
    const password = "Hash@123";
    await userService.update({
      userId: 1000,
      name: "new name",
      email: "some@some.com",
      userName: "someothername",
      password,
      role: roles.manager,
    });
    expect(mockRepository.save).toBeCalled();
    const userModel = mockRepository.save.mock.calls[0][0];
    expect(userModel.role).toEqual(dbRecord.role);
  });
  test("should allow role to be changed by manager", async () => {
    let dbRecord = {
      userId: 1,
      userName: "testuser",
      password: "x",
      name: "new name",
      email: "some@some.com",
      role: roles.user,
    };
    let mockRepository = {
      findOne: jest.fn((params) => dbRecord),
      save: jest.fn((model) => ({ ...model, userId: 2000 })),
    };
    let userService = new UserService(mockRepository, {
      userId: 1000,
      role: roles.manager,
    });
    const password = "Hash@123";
    await userService.update({
      userId: 1,
      name: "new name",
      email: "some@some.com",
      userName: "someothername",
      password,
      role: roles.manager,
    });
    let userModel = mockRepository.save.mock.calls[0][0];
    expect(userModel.role).toEqual(roles.manager);
  });
  test("should allow role to be changed by admin", async () => {
    let dbRecord = {
      userId: 1,
      userName: "testuser",
      password: "x",
      name: "new name",
      email: "some@some.com",
      role: roles.user,
    };
    let mockRepository = {
      findOne: jest.fn((params) => dbRecord),
      save: jest.fn((model) => ({ ...model, userId: 2000 })),
    };
    let userService = new UserService(mockRepository, {
      userId: 1000,
      role: roles.admin,
    });
    const password = "Hash@123";
    await userService.update({
      userId: 1,
      name: "new name",
      email: "some@some.com",
      userName: "someothername",
      password,
      role: roles.manager,
    });
    let userModel = mockRepository.save.mock.calls[0][0];
    expect(userModel.role).toEqual(roles.manager);
  });
});
describe("UserService - Delete User tests", () => {
  test("should not allow non-manager/non-admin to delete user", async () => {
    let dbRecord = {
      userId: 1000,
      userName: "testuser",
      password: "x",
      deleted: false,
      name: "new name",
      email: "some@some.com",
    };
    let mockRepository = {
      findOne: jest.fn((params) => dbRecord),
      save: jest.fn((model) => ({ ...model, userId: 1000 })),
    };
    let userService = new UserService(mockRepository, {
      userId: 1000,
      role: roles.user,
    });
    try {
      await userService.delete(1000);
    } catch (ex) {
      expect(ex.errorCode).toEqual(errorCodes.authorizationError);
    }
  });
  test("should  allow manager/admin to delete user", async () => {
    let dbRecord = {
      userId: 1000,
      userName: "testuser",
      password: "x",
      deleted: false,
    };
    let mockRepository = {
      findOne: jest.fn((params) => dbRecord),
      save: jest.fn((model) => ({ ...model, userId: 1000 })),
    };
    let userService = new UserService(mockRepository, {
      userId: 1000,
      role: roles.manager,
    });
    try {
      const user = await userService.delete(1000);
      expect(user.deleted).toBe(true);
    } catch (ex) {
      fail("No exception expected when delete done by manager");
    }
  });
});
describe("UserService - Get user tests", () => {
  test("should retrieve queried user record", async () => {
    let dbRecord = {
      userId: 1000,
      userName: "testuser",
      password: "x",
      deleted: false,
    };
    let mockRepository = {
      findOne: jest.fn((params) => dbRecord),
      save: jest.fn((model) => ({ ...model, userId: 1000 })),
    };
    let userService = new UserService(mockRepository, {
      userId: 1000,
      role: roles.user,
    });
    const user = await userService.get(1000);
    //findOne called with input parameter
    expect(mockRepository.findOne.mock.calls[0][0].userId).toEqual(1000);
    expect(user.userName).toEqual(dbRecord.userName);
  });
  test("should remove password field when sent out", async () => {
    let dbRecord = {
      userId: 1000,
      userName: "testuser",
      password: "x",
      deleted: false,
    };
    let mockRepository = {
      findOne: jest.fn((params) => dbRecord),
      save: jest.fn((model) => ({ ...model, userId: 1000 })),
    };
    let userService = new UserService(mockRepository, {
      userId: 1000,
      role: roles.user,
    });
    const user = await userService.get(1000);
    expect(user.password).toBeFalsy();
  });
  test("should throw auth error when diff userid is sent", async () => {
    let dbRecord = {
      userId: 1001,
      userName: "testuser",
      password: "x",
      deleted: false,
    };
    let mockRepository = {
      findOne: jest.fn((params) => dbRecord),
      save: jest.fn((model) => ({ ...model, userId: 1000 })),
    };
    let userService = new UserService(mockRepository, {
      userId: 1000,
      role: roles.user,
    });
    try {
      const user = await userService.get(1001);
      fail("Expected to throw exception when queried for diff user");
    } catch (ex) {
      expect(ex.errorCode).toEqual(errorCodes.authorizationError);
    }
  });
});
describe("UserService - Get All tests", () => {
  test("should retrieve all user records", async () => {
    let dbRecords = [
      {
        userId: 1000,
        userName: "testuser",
        password: "x",
        deleted: false,
        name: "first user",
      },
      {
        userId: 1001,
        userName: "testuser2",
        password: "x2",
        deleted: false,
        name: "second User",
      },
    ];
    let mockRepository = {
      find: jest.fn((params) => dbRecords),
    };
    let userService = new UserService(mockRepository, {
      userId: 1000,
      role: roles.user,
    });
    const users = await userService.getAll();
    expect(users.length).toEqual(dbRecords.length);
  });
});
describe("UserService - Login/Logout methods", () => {
  let dbRecord = {
    userId: 1000,
    userName: "testuser",
    password: "$2a$08$xPKsxzG.L9deGhyG1KnHw.lMLIwGt92F7/Se33nfUlzcNGbLLkdY2", //Test@123
    deleted: false,
  };
  let mockRepository = {
    findOne: jest.fn((params) => dbRecord),
  };
  let userService = new UserService(mockRepository, {
    userId: 1000,
    role: roles.user,
  });
  test("wher userName, password missing throws auth error", async () => {
    //password missing scenario
    try {
      const user = await userService.login({ userName: "testuser" });
    } catch (ex) {
      expect(ex.errorCode).toEqual(errorCode.authorizationError);
    }
    //userName missing scenario
    try {
      const user = await userService.login({ password: "testuser" });
    } catch (ex) {
      expect(ex.errorCode).toEqual(errorCode.authorizationError);
    }
  });
  test("when invalid password sent for user, throws auth error", async () => {
    //Invalid password
    try {
      const user = await userService.login({ userName: "testuser", password: "some-other-password" });
    } catch (ex) {
      expect(ex.errorCode).toEqual(errorCodes.authenticationError);
    }
  });
  test("when valid password sent, it succeeds", async () => {
    const user = await userService.login({ userName: "testuser", password: "Test@123" });
    expect(user.userId).not.toBeNull();
  });
  test("user can successfully logout", async () => {
    const result = await userService.logout();
    expect(result).not.toBeNull();
  });
  test("validates if a token is already logged out", async () => {
    const result = await userService.logout("myToken");
    expect(UserService.isLoggedOut("myToken")).toBe(true);
  });
});
