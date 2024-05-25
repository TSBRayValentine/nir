const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite",
  logging: false, // Логирование
});

// Подключение ко второй базе данных
const sequelize_shared = new Sequelize({
  dialect: "sqlite",
  storage: "../../../db_shared.sqlite",
  logging: false, // Логирование
});

module.exports = {
  sequelize,
  sequelize_shared,
};
