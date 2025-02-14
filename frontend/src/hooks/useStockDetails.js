// src/hooks/useStockDetails.js
import { useState, useEffect } from 'react';
import api from '../services/api';

const useStockDetails = (symbol) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        // Calls our new backend endpoint
        const response = await api.get(`/stocks/details/${symbol}`);
        setDetails(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching stock details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [symbol]);

  return { details, loading, error };
};

export default useStockDetails;
