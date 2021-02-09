const winston = require("winston");
/**
 * Wrapper class for logger
 * Prints in console in development environment
 * Can be extended to other formats ( files, graylog etc) in prod env
 */
const logger = winston.createLogger({
  format: winston.format.json(),
  level: "debug",
  transports: [new winston.transports.Console()],
});
module.exports = logger;
