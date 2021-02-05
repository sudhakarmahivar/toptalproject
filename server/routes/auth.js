var express = require("express");

var router = express.Router();
const { logger } = require("../framework/framework");
const UserService = require("../services/user/userService");
router.post("/register", async function (req, res, next) {
  try {
    let service = new UserService();
    let result = await service.create(req.body);
    res.status(200).json(result);
    next && next();
  } catch (err) {
    next(err);
  }
});
router.post("/login", async function (req, res, next) {
  try {
    let service = new UserService();
    let result = await service.login(req.body);
    res.status(200).json(result);
    next && next();
  } catch (err) {
    next(err);
  }
});
module.exports = router;
