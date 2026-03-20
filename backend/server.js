const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const logger = require("./Middleware/logger");
const errorHandler = require("./Middleware/errorHandler");
const taskRoutes = require("./routes/taskRoutes")
const categoryRoutes = require("./routes/categoryRoutes")

const app = express();

// Core middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "10kb" }));
app.use(logger);

// Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/categories", categoryRoutes);

// Health check
app.get("/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime().toFixed(1) + "s", mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected" })
);

app.get("/", (req, res) => res.json({ message: "Todo API v3 🚀" }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` }));

// Global error handler (must be last)
app.use(errorHandler);

// DB + Server start
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todo_db";
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(" MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(` Server → http://localhost:${PORT}`);
    });
  })
  .catch(err => { console.error(" MongoDB:", err.message); process.exit(1); });

// Graceful shutdown
process.on("SIGTERM", () => { mongoose.connection.close(); process.exit(0); });
