// backend/server.js
const express = require("express");
const cors = require("cors");
const yahooFinance = require("yahoo-finance2").default;

const stockRoutes = require("./routes/stockRoutes");
const chartRoutes = require("./routes/chartRoutes");
const insightsRoutes = require("./routes/insightsRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Set up routes under "/api"

app.use("/api/insights", insightsRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/charts", chartRoutes);

app.get("/", (req, res) => {
  res.send("Invest IQ Backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

