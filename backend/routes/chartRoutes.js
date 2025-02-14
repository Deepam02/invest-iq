// backend/routes/chartRoutes.js
const express = require("express");
const router = express.Router();
const { getChartData } = require("../controllers/chartController");

router.get("/:symbol", getChartData);

module.exports = router;
