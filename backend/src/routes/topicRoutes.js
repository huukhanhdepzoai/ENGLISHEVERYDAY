const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");

const {
  createTopic,
  getAllTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
} = require("../controllers/topicController");

router.post("/", verifyToken, createTopic);
router.get("/", verifyToken, getAllTopics);
router.get("/:id", verifyToken, getTopicById);
router.put("/:id", verifyToken, updateTopic);
router.delete("/:id", verifyToken, deleteTopic);

module.exports = router;