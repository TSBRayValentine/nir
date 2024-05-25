const { sequelize } = require("../../../config/db.config");
const Sequelize = require("sequelize");
const final = require("../models/final.model");

const SQL = require("../SQL");
const config = require("../config");

const zlib = require("zlib");

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

    //? Функиция для вычисления интерации
    const calculateSecondIteration = (firstIterationResults, data) => {
      const secondIterationResults = [];

      firstIterationResults.forEach(
        ({ startCurrency, nextCurrency, nextAmount, rialtoStartCurrency }) => {
          const secondStep = data.filter(
            (pair) =>
              pair.baseAsset === nextCurrency ||
              pair.quoteAsset === nextCurrency
          );

          secondStep.forEach((pair) => {
            const finalCurrency =
              pair.baseAsset === nextCurrency
                ? pair.quoteAsset
                : pair.baseAsset;

            const finalAmount =
              pair.baseAsset === nextCurrency
                ? nextAmount * pair.price
                : nextAmount / pair.price;

            secondIterationResults.push({
              startCurrency: startCurrency,
              nextCurrency: nextCurrency,
              nextAmount: nextAmount,
              rialtoStartCurrency: rialtoStartCurrency,
              finalCurrency: finalCurrency,
              finalAmount: finalAmount,
              rialtoNextCurrency: config.crypto_exchange,
            });
          });
        }
      );

      return secondIterationResults;
    };

    // Распаковка данных шага 1
    const decompressedDataStep1 = zlib.inflateSync(req.body).toString();

    // Преобразование обратно в массив объектов шага 1
    const decompressedDataStep1Array = JSON.parse(decompressedDataStep1);

    // Вычисление шага 2
    const arbitrageOpportunities2 = calculateSecondIteration(
      decompressedDataStep1Array,
      data
    );

    // Перевод шага 2 в строку
    const step2String = JSON.stringify(arbitrageOpportunities2);

    // Сжатие данных по шагу 2
    const compressedDataStep2 = zlib.deflateSync(step2String);

    // Отправляем сжатые данные
    res.send(compressedDataStep2);
  } catch (error) {
    res.send(`Произошла ошибка при выполнении запроса ${error}`);
  }
};
