var express = require("express");

var router = express.Router();
const { logger } = require("../framework/framework");

const UserService = require("../services/user/userService");
/**
 * User CRUD routes
 */
router.get("/:userId", async function (req, res, next) {
  try {
    let result = await new UserService().get(req.params.userId);
    res.status(200).json(result);
    next && next();
  } catch (err) {
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    let service = new UserService();
    let result = await service.create(req.body);
    res.status(200).json(result);
    next && next();
  } catch (err) {
    next(err);
  }
});
router.put("/", async function (req, res, next) {
  try {
    let service = new UserService();
    let result = await service.update(req.body);
    res.status(200).json(result);
    next && next();
  } catch (err) {
    next(err);
  }
});
router.delete("/:userId", async function (req, res, next) {
  try {
    let service = new UserService();
    let result = await service.delete(req.params.userId);
    res.status(200).json(result);
    next && next();
  } catch (err) {
    next(err);
  }
});
module.exports = router;
