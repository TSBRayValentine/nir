const price = require("../models/price.model");
const axios = require("axios");
module.exports.action = async (req, res) => {
  try {
    let API = ``;

    API = `https://api.bitget.com/api/spot/v1/market/tickers`;
    const response = await axios.get(API);

    const data = response.data.data.map((item) => {
      return {
        symbol: item.symbol,
        price: item.close,
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
