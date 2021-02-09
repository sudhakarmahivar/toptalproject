var express = require("express");
var router = express.Router();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Toptal Timesheet Services",
      version: "1.0.0",
      description: "Evaluation Project",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/",
      },
      contact: {
        name: "Swagger",
        url: "https://swagger.io",
        email: "Info@SmartBear.com",
      },
    },
    servers: [
      {
        url: "http://localhost:6002",
      },
    ],
  },
  apis: ["./services/user/model/*.js", "./services/timeSheet/model/*.js", "./routes/*.js"],
};
const specs = swaggerJsdoc(options);
router.use("/docs", swaggerUi.serve);
router.get(
  "/docs",
  swaggerUi.setup(specs, {
    explorer: true,
  })
);
module.exports = router;
