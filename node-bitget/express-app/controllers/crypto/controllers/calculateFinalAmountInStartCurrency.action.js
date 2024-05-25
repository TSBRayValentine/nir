const { sequelize } = require("../../../config/db.config");
const Sequelize = require("sequelize");
const shared = require("../models/shared.model");
const zlib = require("zlib");

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

    const calculateFinalAmountInStartCurrency = (
      secondIterationResults,
      data
    ) => {
      const finalResults = [];

      secondIterationResults.forEach(
        ({
          startCurrency,
          nextCurrency,
          finalCurrency,
          finalAmount,
          rialtoStartCurrency,
          rialtoNextCurrency,
        }) => {
          const quotePair = data.find(
            (pair) =>
              (pair.baseAsset === startCurrency &&
                pair.quoteAsset === finalCurrency) ||
              (pair.baseAsset === finalCurrency &&
                pair.quoteAsset === startCurrency)
          );

          if (quotePair) {
            const finalAmountInStartCurrency =
              finalCurrency === quotePair.baseAsset
                ? finalAmount * quotePair.price
                : finalAmount / quotePair.price;

            finalResults.push({
              startCurrency: startCurrency,
              finalCurrency: finalCurrency,
              nextCurrency: nextCurrency,
              finalAmount: finalAmountInStartCurrency,
              rialtoStartCurrency: rialtoStartCurrency,
              rialtoNextCurrency: rialtoNextCurrency,
              rialtoFinalCurrency: config.crypto_exchange,
            });
          }
        }
      );

      return finalResults;
    };

    // Распаковка данных шага 2
    const decompressedDataStep2 = zlib.inflateSync(req.body).toString();

    // Преобразование обратно в массив объектов шага 2
    const decompressedDataStep2Array = JSON.parse(decompressedDataStep2);

    // Вычисление шага финального
    const arbitrageOpportunities3 = calculateFinalAmountInStartCurrency(
      decompressedDataStep2Array,
      data
    );

    // ----------------------------------------------------
    //  Шаг 4 - Сохранение арбитражных вариантов в базу данных

    await shared.bulkCreate(arbitrageOpportunities3);
    console.log("\x1b[95m%s\x1b[0m", "запись в базу данных прошла успешно");

    res.send("успех");
  } catch (error) {
    res.send(`Произошла ошибка при выполнении запроса ${error}`);
  }
};
