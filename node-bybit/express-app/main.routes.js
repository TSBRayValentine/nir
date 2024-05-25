// main.routes.js
const express = require("express");
const router = express.Router();

// Подключение файлов с маршрутами
const crypto_routing = require("./controllers/crypto/crypto.routing");

// Использование файлов как маршрутов
router.use("/crypto", crypto_routing);

module.exports = router;
