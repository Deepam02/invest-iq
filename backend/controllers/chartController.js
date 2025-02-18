// backend/controllers/chartController.js
const yahooFinance = require("yahoo-finance2").default;

const fetchChartData = async (symbol, interval = "1d") => {
  let period1;

  period1 = new Date();
  period1.setFullYear(period1.getFullYear() - 1);

  let chartData;

  // First, try using the Indian exchange formats.
  const nseSymbol = symbol.toUpperCase() + ".NS";
  const bseSymbol = symbol.toUpperCase() + ".BO";

  try {
    chartData = await yahooFinance.chart(nseSymbol, { period1, interval });
    if (chartData) {
      return chartData;
    }
  } catch (error) {
    console.log(`NSE chart lookup failed for ${nseSymbol}: ${error.message}`);
  }

  if (!chartData) {
    try {
      chartData = await yahooFinance.chart(bseSymbol, { period1, interval });
      if (chartData) {
        return chartData;
      }
    } catch (error) {
      console.log(`BSE chart lookup failed for ${bseSymbol}: ${error.message}`);
    }
  }

  // If Indian formats fail, then try a direct lookup (for US stocks).
  try {
    chartData = await yahooFinance.chart(symbol, { period1, interval });
  } catch (error) {
    console.log(`Direct chart lookup failed for ${symbol}: ${error.message}`);
  }

  return chartData;
};

const getChartData = async (req, res) => {
  const { symbol } = req.params;
  const interval = req.query.interval || "1d"; // Use query param if provided
  const chartData = await fetchChartData(symbol, interval);
  if (!chartData) {
    return res
      .status(404)
      .json({ error: "Chart data not found or invalid symbol" });
  }
  res.json(chartData);
};

module.exports = { getChartData };
