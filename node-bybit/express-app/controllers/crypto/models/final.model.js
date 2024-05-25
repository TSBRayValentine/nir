const Sequelize = require("sequelize");
const { sequelize } = require("../../../config/db.config");

// Определение модели пользователя
const final = sequelize.define(
  "final",
  {
    startCurrency: Sequelize.STRING,
    twoCurrency: Sequelize.STRING,
    thirdCurrency: Sequelize.STRING,
    percentage: Sequelize.FLOAT,
  },
  {
    freezeTableName: true, // Замораживаем название таблицы
  }
);

// Экспорт модели пользователя
module.exports = final;
