const info = require("../models/info.model");
const axios = require("axios");
module.exports.action = async (req, res) => {
  try {
    let API = ``;

    API = `https://api.bitget.com/api/spot/v1/public/products`;
    let response = await axios.get(API);

    const data = response.data.data.map((symbol) => {
      return {
        symbol: symbol.symbolName,
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
