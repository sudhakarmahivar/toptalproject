var express = require("express");
var router = express.Router();
const { utils } = require("../framework/framework");
const UserService = require("../services/user/userService");
const routerErrorHandler = require("./routerErrorHandler");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: REST Authentication endpoints
 */

/**
 * @swagger
 *
 *  /register:
 *    post:
 *      summary: User Self registration
 *      tags: [Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: The created user
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.post(
  "/register",
  routerErrorHandler(async function (req, res, next) {
    let service = new UserService();
    let result = await service.create(req.body);
    res.status(200).json(result);
  })
);

/**
 * @swagger
 *
 *  /login:
 *    post:
 *      summary: User login
 *      tags: [Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Login'
 *      responses:
 *        "200":
 *          description: UserModel with accessToken
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.post(
  "/login",
  routerErrorHandler(async function (req, res, next) {
    let service = new UserService();
    let result = await service.login(req.body);
    res.status(200).json(result);
  })
);

/**
 * @swagger
 *
 *  /logout:
 *    post:
 *      summary: User Logout
 *      tags: [Authentication]
 *      requestBody:
 *        required: false
 *      responses:
 *        "200":
 *          description: Returns {status:ok}
 *          content:
 *            application/json:
 */
router.post(
  "/logout",
  routerErrorHandler(async function (req, res, next) {
    let service = new UserService();
    let result = await service.logout(utils.extractAuthToken(req));
    res.status(200).json(result);
  })
);
module.exports = router;
