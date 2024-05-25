const Sequelize = require("sequelize");
const { sequelize } = require("../../../config/db.config");

// Определение модели пользователя
const info = sequelize.define(
  "info",
  {
    symbol: Sequelize.STRING,
    baseAsset: Sequelize.STRING,
    quoteAsset: Sequelize.STRING,
    status: Sequelize.STRING,
  },
  {
    freezeTableName: true, // Замораживаем название таблицы
  }
);

// Экспорт модели пользователя
module.exports = info;
