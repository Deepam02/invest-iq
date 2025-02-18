// StockMarquee.jsx
import React, { useState, useEffect } from "react";
import StockTicker from "../StockTicker";
import "../Navbar/Navbar.css";

const StockMarquee = () => {
  // Define trending stock symbols for India and US
  const trendingIndia = ["RELIANCE", "TCS", "HDFCBANK"];
  const trendingUs = ["AAPL", "GOOG", "TSLA"];

  // Create a refresh counter that increments every 60 seconds
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCounter((prev) => prev + 1);
    }, 60000); // 60 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <marquee behavior="scroll" direction="left" className="marquee">
        {trendingIndia.map((symbol) => (
          <React.Fragment key={symbol + refreshCounter}>
            <StockTicker symbol={symbol} exchange="india" />
            <span>&nbsp;&nbsp;</span>
          </React.Fragment>
        ))}
      </marquee>
      <marquee behavior="scroll" direction="right" className="marquee">
        {trendingUs.map((symbol) => (
          <React.Fragment key={symbol + refreshCounter}>
            <StockTicker symbol={symbol} exchange="us" />
            <span>&nbsp;&nbsp;</span>
          </React.Fragment>
        ))}
      </marquee>
    </div>
  );
};

export default StockMarquee;
