import React, { useState, useEffect } from "react";
import useStock from "../hooks/useStock";
import CompanyOverview from "./CompanyOverview";
import StockChart from "./StockChart";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const StockDashboard = ({ initialSymbol, initialExchange, hideSearch }) => {
  // Local state for search values
  const [inputSymbol, setInputSymbol] = useState(initialSymbol || "");
  const [fetchSymbol, setFetchSymbol] = useState(initialSymbol || null);
  const [exchange, setExchange] = useState(initialExchange || "india");

  // If hideSearch is true, update the local state when props change.
  useEffect(() => {
    if (hideSearch) {
      setInputSymbol(initialSymbol || "");
      setFetchSymbol(initialSymbol || null);
      setExchange(initialExchange || "india");
    }
  }, [initialSymbol, initialExchange, hideSearch]);

  const { stockData, loading, error } = useStock(fetchSymbol, exchange);

  // This function is used only when hideSearch is false (internal search)
  const handleFetchStock = () => {
    const trimmedSymbol = inputSymbol.trim().toUpperCase();
    if (!trimmedSymbol || trimmedSymbol.length < 2) {
      alert("Please enter a valid stock symbol.");
      return;
    }
    setFetchSymbol(trimmedSymbol);
  };

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      {!hideSearch && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "20px",
            alignItems: "center",
          }}
        >
          <TextField
            label="Enter Stock Symbol"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value)}
            variant="outlined"
          />
          <FormControl variant="outlined" size="small">
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
          <Button
            onClick={handleFetchStock}
            variant="contained"
            color="primary"
          >
            Get Stock Info
          </Button>
        </div>
      )}

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {stockData && (
        <div>
          <Typography variant="h5">
            {stockData.shortName} ({stockData.symbol})
          </Typography>
          <Typography>
            <strong>Current Price:</strong> {stockData.currencySymbol}
            {stockData.regularMarketPrice}
          </Typography>
          <Typography>
            <strong>Market Cap:</strong> {stockData.currencySymbol}
            {stockData.marketCap}
          </Typography>

          <StockChart symbol={fetchSymbol} exchange={exchange} />
          <CompanyOverview symbol={fetchSymbol} exchange={exchange} />
        </div>
      )}
    </div>
  );
};

export default StockDashboard;
