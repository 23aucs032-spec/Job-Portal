const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const savedJobController = require("../controllers/savedJobController");


router.post("/save", authMiddleware, savedJobController.saveJob);

router.get("/", authMiddleware, savedJobController.getSavedJobs);

router.delete("/:jobId", authMiddleware, savedJobController.removeSavedJob);


module.exports = router;