/*import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  saveJob,
  unsaveJob,
  getMySavedJobs
} from "../controllers/savedJobController.js";

const router = express.Router();

router.post("/:jobId", auth, saveJob);
router.delete("/:jobId", auth, unsaveJob);
router.get("/my", auth, getMySavedJobs);

export default router;*/


const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  saveJob,
  unsaveJob,
  getMySavedJobs
} = require("../controllers/savedJobController");

const router = express.Router();

router.post("/:jobId", auth, saveJob);
router.delete("/:jobId", auth, unsaveJob);
router.get("/my", auth, getMySavedJobs);

module.exports = router;

