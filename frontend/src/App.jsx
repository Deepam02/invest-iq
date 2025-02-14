// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StockDashboard from './components/StockDashboard';
import InvestmentInsights from './pages/InvestmentInsights';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StockDashboard />} />
        <Route path="/insights" element={<InvestmentInsights />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
