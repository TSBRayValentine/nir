const info = require("../models/info.model");
const axios = require("axios");
module.exports.action = async (req, res) => {
  try {
    let API = ``;

    API = `https://api.binance.com/api/v1/exchangeInfo`;
    const response = await axios.get(API);

    const data = response.data.symbols.map((symbol) => {
      return {
        symbol: symbol.symbol,
        baseAsset: symbol.baseAsset,
        quoteAsset: symbol.quoteAsset,
        status: symbol.status,
      };
    });

    await info.bulkCreate(data);
    res.send("успех");
  } catch (error) {
    res.send(`Произошла ошибка при выполнении запроса ${error}`);
  }
};
