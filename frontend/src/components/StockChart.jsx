// src/components/StockChart.jsx
import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import useChartData from '../hooks/useChartData';
import {
  CircularProgress,
  Alert,
  ButtonGroup,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const StockChart = ({ symbol }) => {
  // Default to candlestick view
  const [chartType, setChartType] = useState('candlestick'); 
  const [interval, setInterval] = useState('1d'); // Options: '1d', '1wk', '1mo'

  const { chartData, loading, error } = useChartData(symbol, interval);

  if (loading) return <CircularProgress sx={{ mt: 2 }} />;
  if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  if (!chartData) return null;

  let options = {};
  let series = [];

  if (chartType === 'candlestick') {
    // Prepare candlestick data (ensure data is in the quotes format with OHLC values)
    let seriesData = [];
    if (chartData.quotes) {
      seriesData = chartData.quotes.map((q) => ({
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
      },
      title: {
        text: `${symbol} Candlestick Chart`,
        align: 'left',
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false, // use local time
          format: 'dd MMM',   // day and month
        },
      },
      yaxis: {
        tooltip: { enabled: true },
        title: { text: 'Price (₹)' },
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        x: {
          format: 'dd MMM yyyy',
        },
      },
    };

    series = [
      {
        name: symbol,
        data: seriesData,
      },
    ];
  } else if (chartType === 'line') {
    // Prepare simple line chart data (using closing prices)
    if (chartData.quotes) {
      const categories = chartData.quotes.map((q) => {
        const date = new Date(q.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      });
      const closePrices = chartData.quotes.map((q) => q.close);

      options = {
        chart: {
          type: 'line',
          zoom: { enabled: true },
          toolbar: { show: true },
        },
        title: {
          text: `${symbol} Line Chart`,
          align: 'left',
        },
        xaxis: {
          categories: categories,
          title: { text: 'Date' },
        },
        yaxis: {
          title: { text: 'Price (₹)' },
        },
        stroke: { curve: 'smooth' },
        tooltip: {
          shared: true,
          intersect: false,
          x: { show: true, format: 'dd/MM' },
        },
      };

      series = [{ name: symbol, data: closePrices }];
    } else {
      return <Alert severity="error">Unexpected chart data format for line chart.</Alert>;
    }
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
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
      </div>
      <Chart
        options={options}
        series={series}
        type={chartType === 'line' ? 'line' : 'candlestick'}
        height={350}
      />
    </div>
  );
};

export default StockChart;
