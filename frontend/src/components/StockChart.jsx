// src/components/StockChart.jsx
import React, { useState } from "react";
import Chart from "react-apexcharts";
import useChartData from "../hooks/useChartData";
import {
  Box,
  CircularProgress,
  Alert,
  ButtonGroup,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const StockChart = ({ symbol }) => {
  // Default settings
  const [chartType, setChartType] = useState("candlestick");
  const [interval, setInterval] = useState("1d"); // Options: '1d', '1wk', '1mo'
  const [theme, setTheme] = useState("light"); // 'dark' or 'light'
  const [refreshCounter, setRefreshCounter] = useState(0);

  const { chartData, loading, error } = useChartData(
    symbol,
    interval,
    "NSE",
    refreshCounter
  );

  // Default to ₹ and check if USD is found in currency
  const currencySymbol = chartData?.meta?.currency === "USD" ? "$" : "₹";

  // Toggle between dark and light themes
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Trigger refresh by updating refreshCounter
  const handleRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  if (loading) return <CircularProgress sx={{ mt: 2 }} />;
  if (error)
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  if (!chartData) return null;

  let options = {};
  let series = [];

  if (chartType === "candlestick") {
    let seriesData = [];
    if (chartData.quotes) {
      seriesData = chartData.quotes.map((q) => ({
        x: new Date(q.date),
        y: [
          parseFloat(q.open.toFixed(2)),
          parseFloat(q.high.toFixed(2)),
          parseFloat(q.low.toFixed(2)),
          parseFloat(q.close.toFixed(2)),
        ],
      }));
    } else {
      return (
        <Alert severity="error">
          Candlestick chart requires OHLC data in quotes format.
        </Alert>
      );
    }

    options = {
      chart: {
        type: "candlestick",
        height: 350,
        zoom: { enabled: true },
        animations: { enabled: false },
        toolbar: { show: true },
        background: theme === "dark" ? "#1e1e1e" : "#fff",
      },
      title: {
        text: `${symbol} Candlestick Chart`,
        align: "left",
        style: { color: theme === "dark" ? "#fff" : "#000" },
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false,
          format: "dd MMM",
          style: { colors: theme === "dark" ? "#fff" : "#000" },
        },
      },
      yaxis: {
        tooltip: { enabled: true },
        title: {
          text: `Price (${currencySymbol})`,
          style: { color: theme === "dark" ? "#fff" : "#000" },
        },
        labels: {
          style: { colors: theme === "dark" ? "#fff" : "#000" },
          formatter: (value) => value.toFixed(2),
        },
      },
      tooltip: {
        enabled: true,
        theme: theme,
        x: { format: "dd MMM yyyy" },
        y: {
          formatter: (value) => `${currencySymbol}${value.toFixed(2)}`,
        },
      },
    };

    series = [
      {
        name: symbol,
        data: seriesData,
      },
    ];
  } else if (chartType === "line") {
    if (chartData.quotes) {
      const categories = chartData.quotes.map((q) => {
        const date = new Date(q.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      });
      const closePrices = chartData.quotes.map((q) =>
        parseFloat(q.close.toFixed(2))
      );

      options = {
        chart: {
          type: "line",
          zoom: { enabled: true },
          toolbar: { show: true },
          background: theme === "dark" ? "#1e1e1e" : "#fff",
        },
        title: {
          text: `${symbol} Line Chart`,
          align: "left",
          style: { color: theme === "dark" ? "#fff" : "#000" },
        },
        xaxis: {
          categories: categories,
          title: {
            text: "Date",
            style: { color: theme === "dark" ? "#fff" : "#000" },
          },
          labels: { style: { colors: theme === "dark" ? "#fff" : "#000" } },
        },
        yaxis: {
          title: {
            text: `Price (${currencySymbol})`,
            style: { color: theme === "dark" ? "#fff" : "#000" },
          },
          labels: {
            style: { colors: theme === "dark" ? "#fff" : "#000" },
            formatter: (value) => value.toFixed(2),
          },
        },
        stroke: { curve: "smooth" },
        tooltip: {
          shared: true,
          intersect: false,
          x: { show: true, format: "dd/MM" },
          theme: theme,
          y: {
            formatter: (value) => `${currencySymbol}${value.toFixed(2)}`,
          },
        },
      };

      series = [{ name: symbol, data: closePrices }];
    } else {
      return (
        <Alert severity="error">
          Unexpected chart data format for line chart.
        </Alert>
      );
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <ButtonGroup variant="contained" aria-label="chart type toggle">
          <Button
            onClick={() => setChartType("line")}
            color={chartType === "line" ? "primary" : "inherit"}
          >
            Line
          </Button>
          <Button
            onClick={() => setChartType("candlestick")}
            color={chartType === "candlestick" ? "primary" : "inherit"}
          >
            Candlestick
          </Button>
        </ButtonGroup>
        <FormControl variant="outlined" size="small">
          <InputLabel id="interval-label">Interval</InputLabel>
          <Select
            labelId="interval-label"
            label="Interval"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          >
            <MenuItem value="1d">1 Day</MenuItem>
            <MenuItem value="1wk">1 Week</MenuItem>
            <MenuItem value="1mo">1 Month</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Refresh Chart">
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle Theme">
          <IconButton onClick={toggleTheme} color="primary">
            {theme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Chart
        key={chartType} // Force re-render when chartType changes
        options={options}
        series={series}
        type={chartType === "line" ? "line" : "candlestick"}
        height={350}
      />
    </Box>
  );
};

export default StockChart;
