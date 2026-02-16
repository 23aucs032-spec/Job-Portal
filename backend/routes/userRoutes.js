const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ================= MULTER CONFIG ================= */

// General upload folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    if (file.fieldname === "profilePic") {
      uploadPath = path.join(__dirname, "..", "uploads", "profilePics");
    } else if (file.fieldname === "resume") {
      uploadPath = path.join(__dirname, "..", "uploads", "resumes");
    } else {
      uploadPath = path.join(__dirname, "..", "uploads", "others");
    }

    // Create folder if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user.id + "-" + Date.now() + ext);
  },
});

const upload = multer({ storage });

/* ================= ROUTES ================= */

// Get logged-in user profile
router.get("/me", authMiddleware, userController.getMyProfile);

// Update user profile fields (JSON)
router.put("/update", authMiddleware, userController.updateProfile);

// Upload resume
router.post(
  "/upload-resume",
  authMiddleware,
  upload.single("resume"),
  userController.uploadResume
);

// Delete resume
router.delete("/delete-resume", authMiddleware, userController.deleteResume);

// Upload profile picture
router.post(
  "/upload-profile-pic",
  authMiddleware,
  upload.single("profilePic"),
  userController.uploadProfilePic
);

module.exports = router;
