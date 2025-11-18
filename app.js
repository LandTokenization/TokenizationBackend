const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const apiRoutes = require("./routes/index");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");

const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.get("/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV || "development" });
});


app.use("/api/v1", apiRoutes);

// 404 + error handler
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
