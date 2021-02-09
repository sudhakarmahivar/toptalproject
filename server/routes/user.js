var express = require("express");

var router = express.Router();
const { logger } = require("../framework/framework");

const UserService = require("../services/user/userService");
const routerErrorHandler = require("./routerErrorHandler");
/**
 * @swagger
 * tags:
 *   name: User
 *   description: REST services for User
 */

/**
 * @swagger
 *
 *  /user:
 *    get:
 *      summary: Fetch User identified by userId
 *      tags: [User]
 *      parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *      responses:
 *        "200":
 *          description: User requested
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.get(
  "/:userId",
  routerErrorHandler(async function (req, res, next) {
    let result = await new UserService().get(req.params.userId);
    res.status(200).json(result);
  })
);
/**
 * @swagger
 *
 *  /user:
 *    get:
 *      summary: Get all users
 *      tags: [User]
 *      responses:
 *        "200":
 *          description: Users requested
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.get(
  "/",
  routerErrorHandler(async function (req, res, next) {
    let result = await new UserService().getAll();
    res.status(200).json(result);
  })
);

/**
 * @swagger
 *
 *  /user:
 *    post:
 *      summary: Create User
 *      tags: [User]
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
  "/",
  routerErrorHandler(async function (req, res, next) {
    let service = new UserService();
    let result = await service.create(req.body);
    res.status(200).json(result);
  })
);
/**
 * @swagger
 *
 *  /user:
 *    put:
 *      summary: Update User
 *      tags: [User]
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
router.put(
  "/",
  routerErrorHandler(async function (req, res, next) {
    let service = new UserService();
    let result = await service.update(req.body);
    res.status(200).json(result);
  })
);

/**
 * @swagger
 *
 *  /user:
 *    delete:
 *      summary: Delete user
 *      tags: [User]
 *      parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *      responses:
 *        "200":
 *          description: User deleted
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.delete(
  "/:userId",
  routerErrorHandler(async function (req, res, next) {
    let service = new UserService();
    let result = await service.delete(req.params.userId);
    res.status(200).json(result);
  })
);
module.exports = router;
