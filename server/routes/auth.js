var express = require("express");

var router = express.Router();
const { utils } = require("../framework/framework");
const UserService = require("../services/user/userService");
const routerErrorHandler = require("./routerErrorHandler");
/**
 * Registers auth related routes
 * No business rules implemented, but should only act as bridge to ServiceClass
 */
router.post(
  "/register",
  routerErrorHandler(async function (req, res, next) {
    let service = new UserService();
    let result = await service.create(req.body);
    res.status(200).json(result);
  })
);
router.post(
  "/login",
  routerErrorHandler(async function (req, res, next) {
    let service = new UserService();
    let result = await service.login(req.body);
    res.status(200).json(result);
  })
);
router.post(
  "/logout",
  routerErrorHandler(async function (req, res, next) {
    let service = new UserService();
    let result = await service.logout(utils.extractAuthToken(req));
    res.status(200).json(result);
  })
);
module.exports = router;
