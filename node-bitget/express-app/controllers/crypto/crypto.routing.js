const express = require("express");

const router = express.Router();

const saveDataInfo = require("./controllers/saveDataInfo.action");
const saveDataPrice = require("./controllers/saveDataPrice.action");

const test = require("./controllers/test.action");
const test2 = require("./controllers/test2.action");
const test3 = require("./controllers/test3.action");
const test4 = require("./controllers/test4.action");
// -------------------------------------------------------
// Получение всех данных о ценах и сохранения в БД

router.get("/saveDataPrice", saveDataPrice.action);

// -------------------------------------------------------
// Получение всех данных о парах и сохранения в БД

router.get("/saveDataInfo", saveDataInfo.action);

// -------------------------------------------------------
// Поиск связок ШАГ 1

const findArbitrageOpportunities = require("./controllers/findArbitrageOpportunities.action");

router.get("/findArbitrageOpportunities", findArbitrageOpportunities.action);

// -------------------------------------------------------
// Поиск связок ШАГ 2

const calculateSecondIteration = require("./controllers/calculateSecondIteration.action");

router.post("/calculateSecondIteration", calculateSecondIteration.action);

// -------------------------------------------------------
// Поиск связок ШАГ 3

const calculateFinalAmountInStartCurrency = require("./controllers/calculateFinalAmountInStartCurrency.action");

router.post(
  "/calculateFinalAmountInStartCurrency",
  calculateFinalAmountInStartCurrency.action
);

//! -------------------------------------------------------
//! TEST

router.post("/test", test.action);

router.get("/test2", test2.action);

router.get("/test3", test3.action);

router.get("/test4", test4.action);

module.exports = router;
