import React, { useState } from "react";
import "./Navbar.css";
import StockMarquee from "../StockMarquee/StockMarquee";

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [exchange, setExchange] = useState("india");

  const handleSearch = () => {
    if (searchQuery.trim().length < 2) {
      alert("Please enter a valid stock symbol.");
      return;
    }
    // Call the onSearch callback with the uppercase symbol and exchange
    onSearch(searchQuery.trim().toUpperCase(), exchange);
  };

  // Check for Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="navbar">
      <div className="marquee-container">
        <StockMarquee/>
      </div>
      <div className="navbar-search">
        <input
          type="text"
          className="search-input"
          placeholder="Search stocks, ETFs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown} // Added event handler
        />
        <select
          className="search-select"
          value={exchange}
          onChange={(e) => setExchange(e.target.value)}
        >
          <option value="india">India</option>
          <option value="us">US</option>
        </select>
        <button className="search-button" onClick={handleSearch}>
          🔍
        </button>
      </div>
    </div>
  );
};

export default Navbar;
