import React, { useState } from 'react';
import useStock from '../hooks/useStock';
import CompanyOverview from './CompanyOverview';
import StockChart from './StockChart';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const StockDashboard = () => {
  const [inputSymbol, setInputSymbol] = useState('');
  const [fetchSymbol, setFetchSymbol] = useState(null);
  const [exchange, setExchange] = useState('india'); // default exchange

  const { stockData, loading, error } = useStock(fetchSymbol, exchange);

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
      <FormControl variant="outlined" size="small" sx={{ ml: 2, minWidth: 120 }}>
        <InputLabel id="exchange-label">Exchange</InputLabel>
        <Select
          labelId="exchange-label"
          label="Exchange"
          value={exchange}
          onChange={(e) => setExchange(e.target.value)}
        >
          <MenuItem value="india">India</MenuItem>
          <MenuItem value="us">US</MenuItem>
        </Select>
      </FormControl>
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
          {/* Pass the exchange value to subcomponents */}
          <StockChart symbol={fetchSymbol} exchange={exchange} />
          <CompanyOverview symbol={fetchSymbol} exchange={exchange} />
        </div>
      )}
    </div>
  );
};

export default StockDashboard;
