const express = require("express");

const cron = require("node-cron");
const axios = require("axios");

const app = express();
const PORT = 3002;
// --------------------------------------------------
// cors политика

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");

const MAX_REQUEST_SIZE = "1000mb"; // Максимальный размер тела запроса
app.use(
  bodyParser.raw({ type: "application/octet-stream", limit: MAX_REQUEST_SIZE })
);

app.use(bodyParser.json({ limit: "1000mb" })); // для парсинга JSON
app.use(bodyParser.urlencoded({ extended: true, limit: "1000mb" }));

// --------------------------------------------------
// Синхронизация моделей с базой данных

const { sequelize, sequelize_shared } = require("./config/db.config");

(async () => {
  try {
    await sequelize.sync(); // Передача { force: true } удалит и пересоздаст таблицы
    await sequelize_shared.sync(); // Передача { force: true } удалит и пересоздаст таблицы
    console.log(`Модели синхронизированы с базой данных`);
  } catch (error) {
    console.error(`Ошибка синхронизации моделей с базой данных:`, error);
  }
})();

// --------------------------------------------------
// Подключение главного файла с маршрутами

const routers = require("./main.routes");

app.use("/api", routers);

async function executeTask() {
  try {
    const response = await axios.post("http://localhost:3002/api/crypto/test");
    console.log("API запрос выполнен успешно:", response.data);
  } catch (error) {
    console.error("Ошибка при выполнении API запроса:", error);
  } finally {
    // После завершения выполнения текущей задачи, вызываем её снова
    executeTask();
  }
}
// Запуск приложения

app.listen(PORT, () => {
  console.log(`Backend запущен на порту ${PORT}`);
  executeTask();
});
