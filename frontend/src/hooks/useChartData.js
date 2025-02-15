// src/hooks/useChartData.js
import { useState, useEffect } from 'react';
import api from '../services/api';

const useChartData = (symbol, interval) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Pass the interval as a query parameter
        const response = await api.get(`/charts/${symbol}?interval=${interval}`);
        setChartData(response.data);
      } catch (err) {
        const errMsg =
          err.response?.data?.error ||
          err.message ||
          "Error fetching chart data";
        setError(errMsg);
        setChartData(null);
      }
      setLoading(false);
    };

    fetchData();
  }, [symbol, interval]);

  return { chartData, loading, error };
};

export default useChartData;