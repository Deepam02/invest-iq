// src/hooks/useStock.js
import { useState, useEffect } from 'react';
import api from '../services/api';

const useStock = (symbol) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) return; // Only fetch when a valid symbol is provided

    const fetchStock = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const response = await api.get(`/stocks/${symbol}`);
        setStockData(response.data);
      } catch (err) {
        console.error(err);
        // Check if error response exists; otherwise use a generic message
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          "Error fetching stock data";
        setError(errorMessage);
        setStockData(null);
      }
      setLoading(false);
    };

    fetchStock();
  }, [symbol]);

  return { stockData, loading, error };
};

export default useStock;
