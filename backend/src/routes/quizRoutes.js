const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const { getQuiz, submitQuiz } = require("../controllers/quizController");

// GET  /api/quizzes/:topicId  — generate questions for a topic
router.get("/:topicId", verifyToken, getQuiz);

// POST /api/quizzes/submit    — grade submitted answers
router.post("/submit", verifyToken, submitQuiz);

module.exports = router;
