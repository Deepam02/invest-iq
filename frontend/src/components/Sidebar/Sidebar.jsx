import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Render the menu button only if the sidebar is closed */}
      { !isOpen && (
        <button className="menu-btn" onClick={toggleSidebar}>
          ☰ Menu
        </button>
      )}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>INVESTIQ</h2>
          <span className="close-btn" onClick={toggleSidebar}>✖</span>
        </div>
        <nav className="sidebar-nav">
          <a href="#">🏠 Home</a>
          <a href="#">📊 AI Insights</a>
          <a href="#">💼 Smart Portfolio</a>
          <a href="#">⚠ Risk Analysis</a>
          <a href="#">⚙ Settings</a>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
