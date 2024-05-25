const price = require("../models/price.model");
const axios = require("axios");
module.exports.action = async (req, res) => {
  try {
    let API = ``;

    API = `https://api.bybit.com/v5/market/tickers?category=spot`;
    const response = await axios.get(API);

    const data = response.data.result.list.map((symbol) => {
      return {
        symbol: symbol.symbol,
        price: symbol.lastPrice,
      };
    });

    await price.bulkCreate(data);
    console.log(
      "\x1b[34m%s\x1b[0m",
      "Обновление информации о валютах завершено"
    );

    res.send("успех");
  } catch (error) {
    res.send(`Произошла ошибка при выполнении запроса ${error}`);
  }
};
