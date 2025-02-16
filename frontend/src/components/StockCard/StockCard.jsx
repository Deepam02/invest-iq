import React from "react";
import "./StockCard.css";

const StockCard = ({ title, children }) => {
  return (
    <div className="stock-card">
      <h3 className="stock-card-title">{title}</h3>
      <div className="stock-card-content">{children}</div>
    </div>
  );
};

export default StockCard;
