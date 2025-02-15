import { useState, useEffect } from 'react';
import api from '../services/api';

const useStockDetails = (symbol, exchange) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!symbol) return;
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/stocks/details/${symbol}?exchange=${exchange}`);
        setDetails(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching stock details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [symbol, exchange]);

  return { details, loading, error };
};

export default useStockDetails;
