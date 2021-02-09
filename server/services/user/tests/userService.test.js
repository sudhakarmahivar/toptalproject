const errorCodes = require("../../../framework/errors/errorCodes");
const { errorMessages } = require("../../../framework/framework");
const roles = require("../../common/roles");
const UserService = require("../userService");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("UserService - Create User tests", () => {
  test("should validate user Name for length and alphanumeric rule", async () => {
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
});
