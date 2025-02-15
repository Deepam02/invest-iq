// src/components/StockChart.jsx
import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import useChartData from '../hooks/useChartData';
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
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const StockChart = ({ symbol }) => {
  // Default settings
  const [chartType, setChartType] = useState('candlestick');
  const [interval, setInterval] = useState('1d'); // Options: '1d', '1wk', '1mo'
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Note: Ensure your useChartData hook accepts the refreshCounter as a dependency.
  const { chartData, loading, error } = useChartData(symbol, interval, /* exchange */ "NSE", refreshCounter);

  // Toggle between dark and light themes
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Trigger refresh by updating refreshCounter
  const handleRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  if (loading) return <CircularProgress sx={{ mt: 2 }} />;
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  if (!chartData) return null;

  let options = {};
  let series = [];

  if (chartType === 'candlestick') {
    // Prepare candlestick data (requires OHLC data in chartData.quotes)
    let seriesData = [];
    if (chartData.quotes) {
      seriesData = chartData.quotes.map(q => ({
        x: new Date(q.date),
        y: [q.open, q.high, q.low, q.close],
      }));
    } else {
      return <Alert severity="error">Candlestick chart requires OHLC data in quotes format.</Alert>;
    }

    options = {
      chart: {
        type: 'candlestick',
        height: 350,
        zoom: { enabled: true },
        animations: { enabled: false },
        toolbar: { show: true },
        background: theme === 'dark' ? '#1e1e1e' : '#fff',
      },
      title: {
        text: `${symbol} Candlestick Chart`,
        align: 'left',
        style: { color: theme === 'dark' ? '#fff' : '#000' },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false,
          format: 'dd MMM',
          style: { colors: theme === 'dark' ? '#fff' : '#000' },
        },
      },
      yaxis: {
        tooltip: { enabled: true },
        title: { text: 'Price (₹)', style: { color: theme === 'dark' ? '#fff' : '#000' } },
        labels: { style: { colors: theme === 'dark' ? '#fff' : '#000' } },
      },
      tooltip: {
        enabled: true,
        theme: theme,
        x: { format: 'dd MMM yyyy' },
      },
    };

    series = [
      {
        name: symbol,
        data: seriesData,
      },
    ];
  } else if (chartType === 'line') {
    // Prepare line chart data (using closing prices)
    if (chartData.quotes) {
      const categories = chartData.quotes.map(q => {
        const date = new Date(q.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      });
      const closePrices = chartData.quotes.map(q => q.close);

      options = {
        chart: {
          type: 'line',
          zoom: { enabled: true },
          toolbar: { show: true },
          background: theme === 'dark' ? '#1e1e1e' : '#fff',
        },
        title: {
          text: `${symbol} Line Chart`,
          align: 'left',
          style: { color: theme === 'dark' ? '#fff' : '#000' },
        },
        xaxis: {
          categories: categories,
          title: { text: 'Date', style: { color: theme === 'dark' ? '#fff' : '#000' } },
          labels: { style: { colors: theme === 'dark' ? '#fff' : '#000' } },
        },
        yaxis: {
          title: { text: 'Price (₹)', style: { color: theme === 'dark' ? '#fff' : '#000' } },
          labels: { style: { colors: theme === 'dark' ? '#fff' : '#000' } },
        },
        stroke: { curve: 'smooth' },
        tooltip: {
          shared: true,
          intersect: false,
          x: { show: true, format: 'dd/MM' },
          theme: theme,
        },
      };

      series = [{ name: symbol, data: closePrices }];
    } else {
      return <Alert severity="error">Unexpected chart data format for line chart.</Alert>;
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      {/* Options & Controls */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 2 }}>
        <ButtonGroup variant="contained" aria-label="chart type toggle">
          <Button onClick={() => setChartType('line')} color={chartType === 'line' ? 'primary' : 'inherit'}>
            Line
          </Button>
          <Button onClick={() => setChartType('candlestick')} color={chartType === 'candlestick' ? 'primary' : 'inherit'}>
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
            {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Box>
      {/* Render Chart */}
      <Chart
        options={options}
        series={series}
        type={chartType === 'line' ? 'line' : 'candlestick'}
        height={350}
      />
    </Box>
  );
};

export default StockChart;
