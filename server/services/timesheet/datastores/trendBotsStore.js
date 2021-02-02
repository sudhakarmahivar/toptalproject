const DBStore = require("../../framework/datastore/dbStore");
const FileStore = require("../../framework/fileStore");
const TrendBotModel = require("./model/TrendBot");
const TrendBotSchema = require("./entity/TrendBotSchema");

// get individual bot Data
class TrendBotsStore extends DBStore {
  getBot = (botId) => {
    return (this.load() || []).find((b) => b.botId === botId);
  };
}
module.exports = new TrendBotsStore(TrendBotModel, TrendBotSchema, "trendBotsStore");
