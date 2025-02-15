import { useState, useEffect } from 'react';
import api from '../services/api';

const useStock = (symbol, exchange) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) return;
    const fetchStock = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/stocks/${symbol}?exchange=${exchange}`);
        setStockData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching stock data");
        setStockData(null);
      }
      setLoading(false);
    };

    fetchStock();
  }, [symbol, exchange]);

  return { stockData, loading, error };
};

export default useStock;
