const info = require("../models/info.model");
const axios = require("axios");
module.exports.action = async (req, res) => {
  try {
    let API = ``;

    API = `https://api.bybit.com/v5/market/instruments-info?category=spot`;
    const response = await axios.get(API);

    const data = response.data.result.list.map((symbol) => {
      return {
        symbol: symbol.symbol,
        baseAsset: symbol.baseCoin,
        quoteAsset: symbol.quoteCoin,
        status: symbol.status,
      };
    });

    await info.bulkCreate(data);
    res.send("успех");
  } catch (error) {
    res.send(`Произошла ошибка при выполнении запроса ${error}`);
  }
};
