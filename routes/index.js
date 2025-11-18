const express = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

const router = express.Router();

// /api/v1/auth
router.use("/auth", authRoutes);     

// /api/v1/users
router.use("/users", userRoutes);

module.exports = router;
