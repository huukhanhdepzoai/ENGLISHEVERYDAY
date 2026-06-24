const db = require("../models");
const Vocabulary = db.Vocabulary;

/**
 * Generate multiple-choice quiz questions for a given topic.
 *
 * Strategy:
 *  - Fetch all vocabulary for the topic as correct answers.
 *  - For each word, build 3 wrong distractors by sampling from other words
 *    in the same topic (or globally if not enough).
 *  - Shuffle options so the correct answer isn't always first.
 */
exports.generateForTopic = async (topicId) => {
  // Words belonging to the requested topic
  const topicWords = await Vocabulary.findAll({
    where: { topicId },
  });

  if (topicWords.length === 0) return [];

  // All other words — used as distractors
  const allWords = await Vocabulary.findAll();

  const questions = topicWords.map((vocab) => {
    // Distractors: other words ≠ current word
    const distractors = allWords
      .filter((v) => v.id !== vocab.id)
      .map((v) => v.meaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Pad with generic distractors if the pool is too small
    while (distractors.length < 3) {
      distractors.push(`Option ${distractors.length + 1}`);
    }

    const options = [...distractors, vocab.meaning].sort(
      () => Math.random() - 0.5
    );

    return {
      id: vocab.id,
      question: `What is the meaning of "${vocab.word}"?`,
      options,
      correctAnswer: vocab.meaning,
    };
  });

  return questions;
};

/**
 * Grade a submitted quiz.
 * answers = [{ questionId, answer }]
 */
exports.grade = async (answers) => {
  let score = 0;
  const details = [];

  for (const { questionId, answer } of answers) {
    const vocab = await Vocabulary.findByPk(questionId);

    if (!vocab) {
      details.push({ questionId, correct: false });
      continue;
    }

    const correct = vocab.meaning.trim() === answer.trim();
    if (correct) score++;
    details.push({ questionId, correct });
  }

  return {
    score,
    total: answers.length,
    details,
  };
};
