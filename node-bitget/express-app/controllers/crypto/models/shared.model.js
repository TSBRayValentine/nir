const Sequelize = require("sequelize");
const { sequelize } = require("../../../config/db.config");

// Определение модели пользователя
const shared = sequelize.define(
  "shared",
  {
    startCurrency: Sequelize.STRING,
    finalCurrency: Sequelize.STRING,
    nextCurrency: Sequelize.STRING,
    finalAmount: Sequelize.FLOAT,
    rialtoStartCurrency: Sequelize.STRING,
    rialtoNextCurrency: Sequelize.STRING,
    rialtoFinalCurrency: Sequelize.STRING,
  },
  {
    freezeTableName: true, // Замораживаем название таблицы
  }
);

// Экспорт модели пользователя
module.exports = shared;
