const express = require("express");
const router = express.Router();

console.log("LESSON ROUTES LOADED");
const verifyToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

const db = require("../models");

const Lesson = db.Lesson;
const LessonVocabulary = db.LessonVocabulary;
const Vocabulary = db.Vocabulary;

// =========================
// CREATE LESSON (TEACHER)
// =========================

router.get("/abc", (req, res) => {
  res.send("ABC WORKING");
});

router.post("/", verifyToken, checkRole("teacher"), async (req, res) => {
  try {
    const { title, classId, topicId } = req.body;

    const lesson = await Lesson.create({
      title,
      classId,
      topicId,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: "Lesson created",
      lesson
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// ADD VOCAB TO LESSON ( FIX MISSING ROUTE)
// =========================
router.post("/add-vocab-test", (req, res) => {
  res.json({
    message: "ADD VOCAB ROUTE WORKING"
  });
});
   
router.post("/add-vocab", verifyToken, checkRole("teacher"), async (req, res) => {
  try {
    const { lessonId, vocabularyId } = req.body;

    // check lesson
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // check vocab
    const vocab = await Vocabulary.findByPk(vocabularyId);
    if (!vocab) {
      return res.status(404).json({ message: "Vocabulary not found" });
    }

    // insert relation
    const link = await LessonVocabulary.create({
      lessonId,
      vocabularyId
    });

    res.json({
      message: "Vocabulary added to lesson",
      link
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// GET LESSON BY CLASS
// =========================
router.get("/class/:classId", verifyToken, async (req, res) => {
  try {
    const lessons = await Lesson.findAll({
      where: { classId: req.params.classId }
    });

    res.json(lessons);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// GET VOCABULARY IN LESSON
// =========================
router.get("/:lessonId/vocabularies", verifyToken, async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.lessonId, {
      include: [
        {
          model: Vocabulary,
          through: { attributes: [] }
        }
      ]
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json(lesson.Vocabularies);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;