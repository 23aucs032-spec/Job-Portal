//import express from "express";
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js")
//import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route example
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "User profile data",
    user: req.user,
  });
});

//export default router;

module.exports = router;