const sequelize = require("../../../config/db.config");
const Sequelize = require("sequelize");
const final = require("../models/final.model");

const zlib = require("zlib");

const axios = require("axios");
const config = require("../config");
module.exports.action = async (req, res) => {
  try {
    console.log("\x1b[32m%s\x1b[0m", "СТАРТ ВЫПОЛНЕНИЯ");
    // Начало замера времени выполнения
    var startTime = Date.now();
    // Шаг 1 - Получение стартовых связок
    let step1 = await axios.get(
      "http://localhost:3003/api/crypto/findArbitrageOpportunities"
    );
    // Данные до компрессии
    step1 = step1.data;

    console.log(`Получены первоначальные связки от узла 3003`);

    const step2Promises = config.nodes_ports.map((node_port) =>
      runer(node_port, step1)
    );

    // Ожидание выполнения всех запросов
    const step2Results = await Promise.all(step2Promises);

    console.log(
      "\x1b[31m%s\x1b[0m",
      "ВЫПОЛНЕНИЕ ВЫЧИСЛЕНИЙ СВЯЗОК ЗАВЕРШЕНО ЗАВЕРШЕНО"
    );

    // Конец замера времени выполнения
    var endTime = Date.now();
    // Вычисление разницы во времени выполнения и преобразование в секунды
    var executionTimeInSeconds = (endTime - startTime) / 1000;

    console.log(
      "\x1b[33m",
      "Время выполнения:",
      executionTimeInSeconds,
      "секунд"
    );

    res.send("успех");
  } catch (error) {
    res.send(`Произошла ошибка при выполнении запроса ${error}`);
  }

  async function runer(node_port, step1) {
    try {
      let url2 = `http://localhost:${node_port}/api/crypto/calculateSecondIteration`;

      const step1String = JSON.stringify(step1);

      // Данные после компрессии
      const compressedDataStep1 = zlib.deflateSync(step1String);

      let step2 = await axios.post(url2, compressedDataStep1, {
        headers: {
          "Content-Type": "application/octet-stream", // Устанавливаем Content-Type как binary
        },
        // Устанавливаем responseType как 'arraybuffer' для получения бинарных данных
        responseType: "arraybuffer",
      });

      // Получили сжатые данные
      step2 = step2.data;
      const bytes = step2.length;

      const megabytes = bytes / (1024 * 1024);
      console.log("\x1b[33m" + megabytes + " Мб\x1b[0m");

      console.log(
        "\x1b[35m" +
          `Вычислены связки с биржей по порту ${node_port}` +
          "\x1b[0m"
      );

      // Шаг 3 - Вычисление финального итерационного шага используя информацию от вычисления узлами

      const promisseFinal = async (node_port_final, step2) => {
        try {
          const url3 = `http://localhost:${node_port_final}/api/crypto/calculateFinalAmountInStartCurrency`;
          const response = await axios.post(url3, step2, {
            headers: {
              "Content-Type": "application/octet-stream", // Устанавливаем Content-Type как binary
            },
          });
          return response;
        } catch (error) {
          console.log(
            `Ошибка при выполнении запроса к порту ${node_port_final}: ${error}`
          );
          // Обработка ошибки, если это необходимо
          // Можно вернуть какое-либо значение по умолчанию или пустой объект в случае ошибки
          return {}; // Например, пустой объект {}
        }
      };

      const finalCalculationsPromises = config.nodes_ports_two
        .filter((node_port_final) => node_port !== node_port_final)
        .map((node_port_final) => promisseFinal(node_port_final, step2));

      // Ожидание выполнения всех запросов
      const finalResults = await Promise.all(finalCalculationsPromises);
      // После завершения всех запросов

      console.log(`Вычислены финальные связки с биржами`);

      console.log(node_port + " - Узел выполнен успешно");
    } catch (error) {
      console.log(
        `Ошибка при обработке запроса к порту ${node_port}: ${error}`
      );
    }
  }
};
