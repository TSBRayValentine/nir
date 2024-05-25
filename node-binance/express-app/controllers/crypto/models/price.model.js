const Sequelize = require("sequelize");
const { sequelize } = require("../../../config/db.config");

// Определение модели пользователя
const price = sequelize.define(
  "price",
  {
    symbol: Sequelize.STRING,
    price: Sequelize.FLOAT,
  },
  {
    freezeTableName: true, // Замораживаем название таблицы
  }
);

// Экспорт модели пользователя
module.exports = price;
