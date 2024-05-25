const price = require("../models/price.model");
const axios = require("axios");
module.exports.action = async (req, res) => {
  try {
    let API = ``;

    API = `https://api.binance.com/api/v3/ticker/price`;
    const response = await axios.get(API);
    await price.bulkCreate(response.data);
    console.log(
      "\x1b[34m%s\x1b[0m",
      "Обновление информации о валютах завершено"
    );

    res.send("успех");
  } catch (error) {
    res.send(`Произошла ошибка при выполнении запроса ${error}`);
  }
};
