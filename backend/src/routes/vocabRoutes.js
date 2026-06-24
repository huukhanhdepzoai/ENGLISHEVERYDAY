const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const checkRole = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validate");
const vocabSchema = require("../validators/vocabValidator");

const {
  createVocab,
  getAllVocab,
  getVocabById,
  updateVocab,
  deleteVocab,
} = require("../controllers/vocabController");

// CREATE (ONLY TEACHER + ADMIN)
router.post(
  "/",
  verifyToken,
  checkRole("teacher", "admin"),
  validate(vocabSchema),
  createVocab
);

// READ (ALL AUTH USERS)
router.get("/", verifyToken, getAllVocab);
router.get("/:id", verifyToken, getVocabById);

// UPDATE (TEACHER + ADMIN)
router.put(
  "/:id",
  verifyToken,
  checkRole("teacher", "admin"),
  updateVocab
);

// DELETE (TEACHER + ADMIN)
router.delete(
  "/:id",
  verifyToken,
  checkRole("teacher", "admin"),
  deleteVocab
);

module.exports = router;