const DBEntitySchema = require("../../../../framework/datastore/dbEntitySchema");
const TrendBot = require("../model/TrendBot");

module.exports = new DBEntitySchema({
  name: "TrendBot",
  target: TrendBot,
  tableName: "trendBot",
  columns: {
    name: { type: "varchar", default: null },
    quantity: { type: "int", default: 0 },
    trend: { type: "tinyint", default: 0 },
    ignoreNeutral: { type: "bool", default: false },
    instrument: { type: "varchar", default: null },
    botId: { type: "varchar", default: null },
    orderState: { type: "varchar", default: null },
    botState: { type: "varchar", default: null },
    buyTick: { type: "float", default: null },
    buyInstrumentTick: { type: "float", default: null },
    tradeRefId: { type: "varchar", default: null },
    buyActive: { type: "bool", default: false },
    trendType: { type: "varchar", default: null },
  },
});
