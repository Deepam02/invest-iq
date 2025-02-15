const yahooFinance = require("yahoo-finance2").default;

/**
 * Helper to fetch basic stock price info for Indian stocks.
 * It tries NSE (symbol.NS) first and then BSE (symbol.BO).
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
 * Endpoint: GET /api/stocks/:symbol
 * Uses a query parameter "exchange" (defaulting to "india") to choose lookup method.
 */
const getStock = async (req, res) => {
  const { symbol } = req.params;
  const exchange = req.query.exchange ? req.query.exchange.toLowerCase() : "india";
  let stockData = null;

  if (exchange === "us") {
    try {
      const result = await yahooFinance.quoteSummary(symbol, { modules: ["price"] });
      if (result && result.price) stockData = result.price;
    } catch (error) {
      console.log(`US lookup failed for ${symbol}: ${error.message}`);
    }
  } else if (exchange === "india") {
    stockData = await fetchStockData(symbol);
  } else {
    return res.status(400).json({ error: "Invalid exchange option" });
  }

  if (!stockData) {
    return res.status(404).json({ error: "Stock not found or invalid symbol" });
  }
  res.json(stockData);
};

/**
 * Endpoint: GET /api/stocks/details/:symbol
 * Uses query parameter "exchange" to choose the lookup method.
 */
const getStockDetails = async (req, res) => {
  const { symbol } = req.params;
  const exchange = req.query.exchange ? req.query.exchange.toLowerCase() : "india";
  let detailedData = null;

  if (exchange === "us") {
    try {
      detailedData = await yahooFinance.quoteSummary(symbol, {
        modules: ["assetProfile", "price", "summaryDetail", "financialData"],
      });
    } catch (err) {
      console.log(`US lookup failed for ${symbol}: ${err.message}`);
    }
  } else if (exchange === "india") {
    const nseSymbol = symbol.toUpperCase() + ".NS";
    const bseSymbol = symbol.toUpperCase() + ".BO";
    try {
      detailedData = await yahooFinance.quoteSummary(nseSymbol, {
        modules: ["assetProfile", "price", "summaryDetail", "financialData"],
      });
    } catch (err) {
      console.log(`NSE lookup failed for ${nseSymbol}: ${err.message}`);
    }
    if (!detailedData) {
      try {
        detailedData = await yahooFinance.quoteSummary(bseSymbol, {
          modules: ["assetProfile", "price", "summaryDetail", "financialData"],
        });
      } catch (err) {
        console.log(`BSE lookup failed for ${bseSymbol}: ${err.message}`);
      }
    }
  } else {
    return res.status(400).json({ error: "Invalid exchange option" });
  }

  if (!detailedData) {
    return res.status(404).json({ error: "Stock details not found or invalid symbol" });
  }
  res.json(detailedData);
};

module.exports = { getStock, getStockDetails };
