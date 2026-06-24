const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

const db = require("../models");
const Vocabulary = db.Vocabulary;
const Topic = db.Topic;
const User = db.User;
const Progress = db.Progress;

// DASHBOARD SUMMARY
router.get(
  "/dashboard",
  verifyToken,
  checkRole("teacher", "admin"),
  async (req, res) => {
    try {
      const vocabCount = await Vocabulary.count();
      const topicCount = await Topic.count();
      const studentCount = await User.count({
        where: { role: "student" }
      });

      res.json({
        vocabCount,
        topicCount,
        studentCount
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;