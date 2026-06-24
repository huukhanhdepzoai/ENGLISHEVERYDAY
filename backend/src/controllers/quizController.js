const quizService = require("../services/quizService");

// GET /api/quizzes/:topicId
exports.getQuiz = async (req, res) => {
  try {
    const { topicId } = req.params;

    if (!topicId || isNaN(topicId)) {
      return res.status(400).json({ message: "Invalid topicId" });
    }

    const questions = await quizService.generateForTopic(Number(topicId));

    if (questions.length === 0) {
      return res.status(404).json({
        message: "No vocabulary found for this topic. Add words first.",
      });
    }

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/quizzes/submit
exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "answers array is required" });
    }

    const result = await quizService.grade(answers);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
