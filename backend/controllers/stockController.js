// backend/controllers/stockController.js
const yahooFinance = require("yahoo-finance2").default;

/**
 * Fetch basic stock data by trying NSE then BSE.
 * Returns the price object if successful, or null if not.
 */
const fetchStockData = async (symbol) => {
  const nseSymbol = symbol.toUpperCase() + ".NS";
  const bseSymbol = symbol.toUpperCase() + ".BO";

  try {
    const result = await yahooFinance.quoteSummary(nseSymbol, { modules: ["price"] });
    if (result && result.price) return result.price;
  } catch (error) {
    console.log(`NSE lookup failed for ${nseSymbol}: ${error.message}`);
  }

  try {
    const result = await yahooFinance.quoteSummary(bseSymbol, { modules: ["price"] });
    if (result && result.price) return result.price;
  } catch (error) {
    console.log(`BSE lookup failed for ${bseSymbol}: ${error.message}`);
  }

  return null;
};

/**
 * Basic stock info endpoint.
 */
const getStock = async (req, res) => {
  const { symbol } = req.params;
  const stockData = await fetchStockData(symbol);
  if (!stockData) {
    return res.status(404).json({ error: "Stock not found or invalid symbol" });
  }
  res.json(stockData);
};

/**
 * Detailed stock info endpoint.
 * Tries the NSE version first; if it fails, falls back to the BSE version.
 */
const getStockDetails = async (req, res) => {
  const { symbol } = req.params;
  const nseSymbol = symbol.toUpperCase() + ".NS";
  const bseSymbol = symbol.toUpperCase() + ".BO";
  let detailedData = null;

  try {
    // Try NSE version first
    detailedData = await yahooFinance.quoteSummary(nseSymbol, {
      modules: ["assetProfile", "price", "summaryDetail", "financialData"],
    });
  } catch (err) {
    console.log(`NSE lookup failed for ${nseSymbol}: ${err.message}`);
  }

  if (!detailedData) {
    try {
      // Fallback to BSE version
      detailedData = await yahooFinance.quoteSummary(bseSymbol, {
        modules: ["assetProfile", "price", "summaryDetail", "financialData"],
      });
    } catch (err) {
      console.log(`BSE lookup failed for ${bseSymbol}: ${err.message}`);
    }
  }

  if (!detailedData) {
    return res
      .status(404)
      .json({ error: "Stock details not found or invalid symbol" });
  }

  res.json(detailedData);
};

module.exports = { getStock, getStockDetails };
