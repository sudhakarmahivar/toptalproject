import moment from "moment";
const utils = {
  isManagerOrAdmin: (role) => ["m", "a"].includes(role),
  getFormattedDate: (date) => {
    if (!date) date = moment();
    return moment(date).format("YYYY-MM-DD");
  },
};
export default utils;
