const FileStore = require("../../framework/fileStore");

// get individual bot Data
class TrendBotsStore extends FileStore {
  getBot = (botId) => {
    return (this.load() || []).find((b) => b.botId === botId);
  };
  // set individual bot data
  saveBot = (botState) => {
    const bots = this.load() || [];
    const currentBot = bots.find((b) => b.botId === botState.botId);
    if (currentBot) {
      Object.assign(currentBot, botState);
    } else {
      bots.push(botState);
    }
    this.save(bots);
    return botState;
  };
}
module.exports = new TrendBotsStore("trendBots/trendBots");
