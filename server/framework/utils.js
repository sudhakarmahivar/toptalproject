const moment = require("moment");
const winston = require("winston");
const utils = {
  getFormattedDate(date) {
    date = date || new Date();
    return moment(date).format("YYYY-MM-DD");
  },
  isValidPastDate(date) {
    return moment(date, "YYYY-MM-DD").isBefore(moment());
  },
  extractAuthToken(req) {
    return req.headers.authorization.replace(/^bearer/gi, "").replace(" ", "");
  },
};
module.exports = utils;
