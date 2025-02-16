// backend/routes/insightsRoutes.js
const express = require("express");
const router = express.Router();
const { getInvestmentInsights } = require("../controllers/insightsController");

router.get("/", getInvestmentInsights);

module.exports = router;
