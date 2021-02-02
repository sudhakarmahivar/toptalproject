const Model = require("../../../../framework/datastore/Model");
const trendvalues = require("../../../framework/trendValues");
const botStates = require("../../../framework/botStates");
const orderStates = require("../../../framework/orderStates");

module.exports = class Timesheet extends (
  Model
) {
  name = null;
  quantity = 0;
  trend = trendvalues.neutral;
  ignoreNeutral = true;
  instrument = null;
  botId = null;
  orderState = orderStates.none;
  botState = botStates.active;
  buyTick = null;
  tradeRefId = null;
  buyActive = false;
  buyInstrumentTick = null;
  trendType = null;
};
