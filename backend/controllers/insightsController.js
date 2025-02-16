const yahooFinance = require("yahoo-finance2").default;

const getInvestmentInsights = async (req, res) => {
  try {
    // Get region and count from query params (default region is "US")
    const region = req.query.region || "US";
    const count = parseInt(req.query.count) || null;

    // 1️⃣ Fetch trending stock symbols for the selected region
    const trendingData = await yahooFinance.trendingSymbols(region);
    const symbols = trendingData.quotes.map(stock => stock.symbol);

    if (symbols.length === 0) {
      return res.status(404).json({ message: `No trending stocks found for ${region}.` });
    }

    // If count is provided, limit the symbols array
    const limitedSymbols = count ? symbols.slice(0, count) : symbols;

    // 2️⃣ Fetch detailed stock insights for each symbol
    const stockData = await Promise.all(
      limitedSymbols.map(symbol => yahooFinance.quote(symbol))
    );

    // 3️⃣ Structure the response with additional stock details
    const insights = stockData.map(stock => ({
      symbol: stock.symbol,
      name: stock.shortName || "N/A",
      price: stock.regularMarketPrice ? stock.regularMarketPrice.toFixed(2) : "N/A",
      change: stock.regularMarketChangePercent
        ? (stock.regularMarketChangePercent * 100).toFixed(2)
        : "0.00",
      volume: stock.regularMarketVolume
        ? stock.regularMarketVolume.toLocaleString()
        : "N/A",
      marketCap: stock.marketCap
        ? `$${(stock.marketCap / 1e9).toFixed(2)}B`
        : "N/A",
      previousClose: stock.regularMarketPreviousClose
        ? stock.regularMarketPreviousClose.toFixed(2)
        : "N/A",
      open: stock.regularMarketOpen
        ? stock.regularMarketOpen.toFixed(2)
        : "N/A",
      high: stock.regularMarketDayHigh
        ? stock.regularMarketDayHigh.toFixed(2)
        : "N/A",
      low: stock.regularMarketDayLow
        ? stock.regularMarketDayLow.toFixed(2)
        : "N/A",
      trend:
        stock.regularMarketChangePercent > 0 ? "📈 Bullish" : "📉 Bearish",
    }));

    res.json({ region, insights });
  } catch (error) {
    console.error("Yahoo Finance API Error:", error);
    res.status(500).json({ message: "Error fetching stock insights." });
  }
};

module.exports = { getInvestmentInsights };
