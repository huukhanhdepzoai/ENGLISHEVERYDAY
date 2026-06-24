const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");

const db = require("../models");
const Class = db.Class;
const StudentClass = db.StudentClass;

// =========================
// CREATE CLASS (TEACHER)
// =========================
router.post("/", verifyToken, checkRole("teacher"), async (req, res) => {
  try {
    const { className } = req.body;

    const newClass = await Class.create({
      className,
      teacherId: req.user.id
    });

    res.status(201).json({
      message: "Class created",
      class: newClass
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// JOIN CLASS (STUDENT)
// =========================
router.post("/join", verifyToken, checkRole("student"), async (req, res) => {
  try {
    const { classId } = req.body;

    await StudentClass.create({
      studentId: req.user.id,
      classId
    });

    res.json({
      message: "Joined class successfully"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// GET MY CLASSES
// =========================
router.get("/my", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const classes = await Class.findAll({
      include: [
        {
          model: db.User,
          as: "students"
        }
      ],
      where: {
        teacherId: userId
      }
    });

    res.json(classes);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;