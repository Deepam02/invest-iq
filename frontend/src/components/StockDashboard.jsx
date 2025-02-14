// src/components/StockDashboard.jsx
import React, { useState } from 'react';
import useStock from '../hooks/useStock';
import StockChart from './StockChart';
import CompanyOverview from './CompanyOverview';
import { TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';

const StockDashboard = () => {
  const [inputSymbol, setInputSymbol] = useState('');
  const [fetchSymbol, setFetchSymbol] = useState(null);
  const { stockData, loading, error } = useStock(fetchSymbol);

  const handleFetchStock = () => {
    const trimmedSymbol = inputSymbol.trim().toUpperCase();
    if (!trimmedSymbol || trimmedSymbol.length < 2) {
      alert("Please enter a valid stock symbol.");
      return;
    }
    setFetchSymbol(trimmedSymbol);
  };

  return (
    <div>
      <TextField
        label="Enter Stock Symbol"
        value={inputSymbol}
        onChange={(e) => setInputSymbol(e.target.value)}
        variant="outlined"
      />
      <Button onClick={handleFetchStock} variant="contained" color="primary" sx={{ ml: 2 }}>
        Get Stock Info
      </Button>

      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {stockData && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h5">
            {stockData.shortName} ({stockData.symbol})
          </Typography>
          <Typography>
            <strong>Current Price:</strong> ₹{stockData.regularMarketPrice}
          </Typography>
          <Typography>
            <strong>Market Cap:</strong> ₹{stockData.marketCap}
          </Typography>
          {/* Chart component */}
          <StockChart symbol={fetchSymbol} />
          {/* Company Overview component */}
          <CompanyOverview symbol={fetchSymbol} />
        </div>
      )}
    </div>
  );
};

export default StockDashboard;
