const express = require("express");
const router = express.Router();

const recruiterController = require("../controllers/recruiterController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadLogo = require("../middleware/uploadLogo");

router.post("/register", recruiterController.registerRecruiter);
router.post("/login", recruiterController.loginRecruiter);
router.get("/profile", authMiddleware, recruiterController.getProfile);
router.put(
  "/profile",
  authMiddleware,
  uploadLogo.single("logo"),
  recruiterController.updateProfile
);

module.exports = router;