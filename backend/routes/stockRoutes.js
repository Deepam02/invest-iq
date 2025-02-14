// backend/routes/stockRoutes.js
const express = require("express");
const router = express.Router();
const { getStock, getStockDetails } = require("../controllers/stockController");

// Existing endpoint for basic stock info
router.get("/:symbol", getStock);

// New endpoint for detailed stock info
router.get("/details/:symbol", getStockDetails);

module.exports = router;
