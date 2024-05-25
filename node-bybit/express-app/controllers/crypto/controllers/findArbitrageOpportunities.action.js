const { sequelize } = require("../../../config/db.config");
const Sequelize = require("sequelize");

const SQL = require("../SQL");
const config = require("../config");

module.exports.action = async (req, res) => {
  // ----------------------------------------------------
  //  Шаг 1 - Получение цен и базовых криптовалют
  try {
    const data = await sequelize.query(SQL.ALL_DATA, {
      type: Sequelize.QueryTypes.SELECT,
    });

    // ----------------------------------------------------
    //  Шаг 2 - Получение всех криптовалют

    let crypto = await sequelize.query(SQL.ALL_CRYPTO, {
      type: Sequelize.QueryTypes.SELECT,
    });

    crypto.map((el) => {
      el.unique_values = el.unique_values;
    });

    crypto = crypto.map((item) => item.unique_values);

    // ----------------------------------------------------
    //  Шаг 3 - Поиск арбитражных вариантов

    const findArbitrageOpportunities = (
      data,
      currencies = ["ZRX", "ZEN"],
      startAmount = 10
    ) => {
      const opportunities = [];

      // Preprocess data to create a map of currencies
      const currencyMap = new Map();
      data.forEach((pair) => {
        if (!currencyMap.has(pair.baseAsset)) {
          currencyMap.set(pair.baseAsset, []);
        }
        currencyMap.get(pair.baseAsset).push(pair);
        if (!currencyMap.has(pair.quoteAsset)) {
          currencyMap.set(pair.quoteAsset, []);
        }
        currencyMap.get(pair.quoteAsset).push(pair);
      });
      currencies.forEach((startCurrency) => {
        const firstStep = currencyMap.get(startCurrency) || [];
        firstStep.forEach((pair) => {
          const nextCurrency =
            pair.baseAsset === startCurrency ? pair.quoteAsset : pair.baseAsset;

          const nextAmount =
            startCurrency === pair.baseAsset
              ? startAmount * pair.price
              : startAmount / pair.price;

          // Push data directly to opportunities array
          opportunities.push({
            startCurrency: startCurrency,
            nextCurrency: nextCurrency,
            rialtoStartCurrency: config.crypto_exchange,
            nextAmount: nextAmount,
          });
        });
      });

      return opportunities;
    };

    const arbitrageOpportunities = findArbitrageOpportunities(
      data,
      (currencies = crypto)
    );
    // const arbitrageOpportunities = findArbitrageOpportunities(data);

    // ----------------------------------------------------
    //  Шаг 4 - Сохранение арбитражных вариантов в базу данных

    // await final.bulkCreate(arbitrageOpportunities);

    res.send(arbitrageOpportunities);
  } catch (error) {
    res.send(`Произошла ошибка при выполнении запроса ${error}`);
  }
};
