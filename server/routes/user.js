var express = require("express");

var router = express.Router();
const { logger } = require("../framework/framework");

const UserService = require("../services/user/userService");
const routerErrorHandler = require("./routerErrorHandler");
/**
 * User CRUD routes
 */
router.get(
  "/:userId",
  routerErrorHandler(async function (req, res, next) {
    let result = await new UserService().get(req.params.userId);
    res.status(200).json(result);
  })
);
router.get(
  "/",
  routerErrorHandler(async function (req, res, next) {
    let result = await new UserService().getAll();
    res.status(200).json(result);
  })
);
router.post(
  "/",
  routerErrorHandler(async function (req, res, next) {
    let service = new UserService();
    let result = await service.create(req.body);
    res.status(200).json(result);
  })
);
router.put(
  "/",
  routerErrorHandler(async function (req, res, next) {
    let service = new UserService();
    let result = await service.update(req.body);
    res.status(200).json(result);
  })
);
router.delete(
  "/:userId",
  routerErrorHandler(async function (req, res, next) {
    let service = new UserService();
    let result = await service.delete(req.params.userId);
    res.status(200).json(result);
  })
);
module.exports = router;
