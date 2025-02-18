// StockTicker.jsx
import React from 'react';
import useStock from '../hooks/useStock';

const StockTicker = ({ symbol, exchange }) => {
  const { stockData, loading, error } = useStock(symbol, exchange);

  if (loading) return <span>{symbol}: Loading...</span>;
  if (error || !stockData) return <span>{symbol}: Error</span>;

  // Determine if bullish (up) or bearish (down)
  const isBullish = stockData.regularMarketChange >= 0;
  const arrow = isBullish ? (
    <span style={{ color: 'green' }}>▲</span>
  ) : (
    <span style={{ color: 'red' }}>▼</span>
  );

  return (
    <span>
      {symbol} {arrow} {stockData.currencySymbol}
      {stockData.regularMarketPrice.toFixed(2)}
    </span>
  );
};

export default StockTicker;
