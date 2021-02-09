const passwordValidator = require("password-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const { UserContext, errorMessages } = require("../../framework/framework");
const config = require("../../config");
const { getRepository } = require("../../framework/datastore/dbConnectionManager");
const UserModel = require("./model/userModel");
const roles = require("../common/roles");
const ValidationError = require("../../framework/errors/validationError");
const AuthorizationError = require("../../framework/errors/authorizationError");
const AuthenticationError = require("../../framework/errors/authenticationError");
const ResourceNotFoundError = require("../../framework/errors/ResourceNotFoundError");

class UserService {
  repository = null;
  userContext = null;
  passwordSchema = null;

  //Temp Solution: Logged out tokens stored in-memory as against
  //proper cache or db
  static loggedOutTokens = [];

  constructor(repository, userContext) {
    this.repository = repository || getRepository(UserModel);
    this.userContext = userContext || UserContext.get();
    this.passwordSchema = new passwordValidator();
    this.passwordSchema
      .is()
      .min(8) // Minimum length 8
      .is()
      .max(12) // Maximum length 100
      .has()
      .uppercase() // Must have uppercase letters
      .has()
      .digits() // Must have at least 2 digits
      .has()
      .not()
      .spaces()
      .has()
      .symbols();
  }
  //
  // Helper Methods
  //
  validateModel(userModel, skipPasswordCheck = false) {
    const { userName, password, name, workingHoursPerDay, email } = userModel;
    if (!userName) throw new ValidationError(errorMessages.userNameError);

    //values sent
    //user name rules
    if (userName.length < 8 || userName.length > 25 || !userName.match(/^[0-9a-z]+$/i)) {
      throw new ValidationError(errorMessages.userNameError);
    }
    if (!skipPasswordCheck) {
      if (!this.passwordSchema.validate(password)) throw new ValidationError(errorMessages.passwordRulesError);
    }

    if (!name || !name.match(/^[a-z\s]+$/i) || name.length > 50) {
      throw new ValidationError(errorMessages.nameError);
    }
    if (!email || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      throw new ValidationError(errorMessages.emailError);
    }
    if (typeof workingHoursPerDay === "undefined" || workingHoursPerDay === null) {
      //User has not sent his working Hours Per day. this should be ok
      userModel.workingHoursPerDay = 8;
    } else if (workingHoursPerDay < 0 || workingHoursPerDay > 24) {
      //User has sent this explicitly then validate
      throw new ValidationError(errorMessages.workingHoursPerDayError);
    }
  }

  //
  // Service end points
  //
  async create(userModel) {
    const { userName } = userModel;
    const { userId: loggedInUserId, role: loggedInUserRole } = this.userContext;
    //validate user name doesnt exist
    let dbRecord = await this.repository.findOne({ userName });
    if (dbRecord) throw new ValidationError(errorMessages.userNameError);

    userModel.createdBy = loggedInUserId;

    //when non admin creating a user, assign it a User role
    //If admin or manager attempting to create user, use the role sent in payload
    if (loggedInUserRole !== roles.manager && loggedInUserRole !== roles.admin) {
      userModel.role = roles.user;
    }

    this.validateModel(userModel);
    //hash password for storage
    var hashedPassword = bcrypt.hashSync(userModel.password, 8);
    userModel.password = hashedPassword;

    userModel = await this.repository.save(userModel);
    delete userModel.password;
    return userModel;
  }

  async update(userModel) {
    const { userId } = userModel;
    let dbRecord = this.repository.findOne({ userId, deleted: false });
    if (!dbRecord) throw new ResourceNotFoundError(errorMessages.userDoesntExist);

    const { userId: loggedInUserId, role: loggedInUserRole } = this.userContext;

    //Validate if you are authorized
    let allowed = false;
    if (dbRecord.userId === loggedInUserId) {
      //user can't change his role
      allowed = true;
      userModel.role = dbRecord.role; //in case of self update, retain original role
    } else if (loggedInUserRole === roles.manager || loggedInUserRole === roles.admin) {
      //admin allowed to change role, password
      allowed = true;
    }
    if (!allowed) throw new AuthorizationError(errorMessages.notAuthorizedForUserRecord);

    userModel.updatedBy = loggedInUserId;
    this.validateModel(userModel, true);
    userModel = await this.repository.save(userModel);
    delete userModel.password;

    return userModel;
  }

  async delete(userId) {
    const { userId: loggedInUserId, role: loggedInUserRole } = this.userContext;
    if (loggedInUserRole === roles.user) throw new AuthorizationError();

    let dbRecord = await this.repository.findOne({ userId, deleted: false });
    if (!dbRecord) throw new ResourceNotFoundError(errorMessages.userDoesntExist);
    dbRecord.deleted = true;

    dbRecord.updatedBy = loggedInUserId;
    dbRecord = await this.repository.save(dbRecord);
    delete dbRecord.password;
    return dbRecord;
  }

  async get(userId) {
    if (!userId) return null;
    userId = Number(userId);
    const { userId: loggedInUserId, role } = this.userContext;
    if (userId === loggedInUserId || role === roles.manager || role === roles.admin) {
      const user = await this.repository.findOne({ userId });
      if (!user) throw new ResourceNotFoundError(errorMessages.userDoesntExist);
      delete user.password;
      return user;
    } else throw new AuthorizationError();
  }
  async getAll() {
    let users = await this.repository.find({ deleted: false });
    users.forEach((user) => {
      delete user.password;
    });
    return users;
  }

  async login(loginModel) {
    const { userName, password } = loginModel;
    if (!userName || !password) return new AuthenticationError();
    var dbUser = await this.repository.findOne({ userName, deleted: false });
    if (!dbUser) throw new ResourceNotFoundError(errorMessages.userDoesntExist);
    var passwordIsValid = bcrypt.compareSync(password, dbUser.password);
    if (!passwordIsValid) throw new AuthenticationError(errorMessages.invalidCredentials);

    var accessToken = jwt.sign({ userId: dbUser.userId, role: dbUser.role }, config.authSecret, {
      expiresIn: config.tokenExpiresIn,
    });
    delete dbUser.password;

    return { ...dbUser, accessToken, expiresIn: config.tokenExpiresIn };
  }
  async logout(token) {
    if (token) {
      !UserService.loggedOutTokens.includes(token) && UserService.loggedOutTokens.push(token);
    }
    return { status: "ok" };
  }
  //Temp solution for logout
  static isLoggedOut(token) {
    return UserService.loggedOutTokens.includes(token);
  }
}
module.exports = UserService;
