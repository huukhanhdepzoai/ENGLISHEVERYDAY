const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");

const {
  createProgress,
  getAllProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
} = require("../controllers/progressController");

router.post("/", verifyToken, createProgress);
router.get("/", verifyToken, getAllProgress);
router.get("/:id", verifyToken, getProgressById);
router.put("/:id", verifyToken, updateProgress);
router.delete("/:id", verifyToken, deleteProgress);

module.exports = router;