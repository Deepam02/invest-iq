import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import StockCard from "../../components/StockCard/StockCard";
import StockDashboard from "../../components/StockDashboard";
import "./Home.css";

const API_KEY = "8R7K9RPX87FWAJYN";

const Home = () => {
  const [topGainers, setTopGainers] = useState([]);
  const [marketNews, setMarketNews] = useState([]);
  const [sectorPerformance, setSectorPerformance] = useState([]);
  const [searchParams, setSearchParams] = useState({
    symbol: "",
    exchange: "india",
  });
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    async function fetchMarketData() {
      try {
        const gainersRes = await fetch(
          `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`
        );
        const gainers = await gainersRes.json();
        setTopGainers(gainers.top_gainers?.slice(0, 5) || []);

        const newsRes = await fetch(
          `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${API_KEY}`
        );
        const news = await newsRes.json();
        setMarketNews(news.feed?.slice(0, 5) || []);

        const sectorRes = await fetch(
          `https://www.alphavantage.co/query?function=SECTOR&apikey=${API_KEY}`
        );
        const sectorJson = await sectorRes.json();
        setSectorPerformance(
          Object.entries(sectorJson["Rank A: 1 Day Performance"] || {}).slice(
            0,
            5
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchMarketData();
  }, []);

  // onSearch callback from Navbar: set search parameters and show dashboard
  const handleSearch = (symbol, exchange) => {
    setSearchParams({ symbol, exchange });
    setShowDashboard(true);
  };

  return (
    <div className="home-container">
      <Sidebar />
      <div className="main-content">
        <Navbar onSearch={handleSearch} />
        {showDashboard && (
          <StockDashboard
            initialSymbol={searchParams.symbol}
            initialExchange={searchParams.exchange}
            hideSearch={true} // Hides the internal search bar of StockDashboard
          />
        )}
        <div className="cards-grid">
          <StockCard title="#TOP Stocks">
            {topGainers.length > 0 ? (
              topGainers.map((stock) => (
                <div key={stock.ticker} className="card-item">
                  <span>{stock.ticker}</span>
                  <span>{stock.price}</span>
                  <span className="positive-change">
                    ▲ {stock.change_percent}
                  </span>
                </div>
              ))
            ) : (
              <p className="error-text">No data available</p>
            )}
          </StockCard>
          <StockCard title="Sensex Market Updates">
            {marketNews.length > 0 ? (
              marketNews.map((news, index) => (
                <div key={index} className="card-item">
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noreferrer"
                    className="news-link"
                  >
                    {news.title}
                  </a>
                </div>
              ))
            ) : (
              <p className="error-text">No news available</p>
            )}
          </StockCard>
          <StockCard title="Market & Sectors">
            {sectorPerformance.length > 0 ? (
              sectorPerformance.map(([sector, change], index) => (
                <div key={index} className="card-item">
                  <span>{sector}</span>
                  <span className="positive-change">{change}</span>
                </div>
              ))
            ) : (
              <p className="error-text">No sector data available</p>
            )}
          </StockCard>
        </div>
      </div>
    </div>
  );
};

export default Home;
