const { logger, UserContext, utils, errorMessages } = require("../../framework/framework");
const { getRepository } = require("../../framework/datastore/dbConnectionManager");
const UserModel = require("./model/userModel");
const roles = require("../common/roles");
const ValidationError = require("../../framework/errors/validationError");
const AuthorizationError = require("../../framework/errors/authorizationError");
const ResourceNotFoundError = require("../../framework/errors/ResourceNotFoundError");
const passwordValidator = require("password-validator");

class UserService {
  repository = null;
  userContext = null;
  passwordSchema = null;

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
  validateModel(userModel) {
    const { userName, password } = userModel;
    if (userName && password) {
      //values sent
      //user name rules
      if (userName.length < 8 || !userName.match(/^[0-9a-z]+$/i)) {
        throw new ValidationError(errorMessages.userNameError);
      }
      if (!this.passwordSchema.validate(password)) throw new ValidationError(errorMessages.passwordRulesError);

      //now valid userName, password
    } else throw new ValidationError("One or more fields missing value");
  }

  //
  // Service end points
  //
  async create(userModel) {
    const { userName } = userModel;
    const { userId: loggedInUserId, role: loggedInUserRole } = this.userContext;
    //validate user name doesnt exist
    let dbRecord = await this.repository.findOne({ userName });
    if (dbRecord) throw new ValidationError("User name already exists");

    //save
    userModel.createdBy = loggedInUserId;
    //when non admin creating a user, assign it a User role
    //If admin or manager attempting to create user, use the role sent in payload
    if (loggedInUserRole !== roles.manager && loggedInUserRole !== roles.admin) {
      userModel.role = roles.user;
    }
    this.validateModel(userModel);
    userModel = await this.repository.save(userModel);
    return userModel;
  }
  async update(userModel) {
    const { userId } = userModel;
    let dbRecord = this.repository.findOne({ userId, deleted: false });
    if (!dbRecord) throw new ResourceNotFoundError("User doesnt exist");

    const { userId: loggedInUserId, role: loggedInUserRole } = this.userContext;

    //Allow password change
    userModel.userName = dbRecord.userName;

    //Validate if you are authorized
    let allowed = false;
    if (dbRecord.userId === loggedInUserId) {
      //user can't change his role
      allowed = true;
      userModel.role = dbRecord.role;
    } else if (loggedInUserRole === roles.manager || loggedInUserRole === roles.admin) {
      //admin allowed to chagne role, password
      allowed = true;
    }
    if (!allowed) throw new AuthorizationError("Not authorized for User record");
    //save
    userModel.updatedBy = loggedInUserId;
    userModel = await this.repository.save(userModel);
    return userModel;
  }

  async delete(userId) {
    const { userId: loggedInUserId, role: loggedInUserRole } = this.userContext;
    if (loggedInUserRole === roles.user) throw new AuthorizationError();

    let dbRecord = await this.repository.findOne({ userId, deleted: false });
    if (!dbRecord) throw new ResourceNotFoundError("User doesnt exist");
    dbRecord.deleted = true;

    //save
    dbRecord.updatedBy = loggedInUserId;
    dbRecord = await this.repository.save(dbRecord);
    return dbRecord;
  }

  async get(userId) {
    if (!userId) return null;
    userId = Number(userId);
    const { userId: loggedInUserId, role } = this.userContext;
    if (userId === loggedInUserId || role === roles.manager || role === roles.admin)
      return await this.repository.findOne({ userId });
    else throw new AuthorizationError();
  }
}
module.exports = UserService;
