const progressService = require("../services/progressService");

// CREATE
exports.createProgress = async (req, res) => {
  try {
    const data = {
      userId: req.user.id,                 // lấy từ token student
      lessonId: req.body.lessonId,
      vocabularyId: req.body.vocabularyId,
      isLearned: req.body.isLearned
    };

    const progress = await progressService.create(data);

    res.status(201).json(progress);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// GET ALL
exports.getAllProgress = async (req, res) => {
  try {
    const list = await progressService.getAll();

    res.json(list);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// GET BY ID
exports.getProgressById = async (req, res) => {
  try {
    const item = await progressService.getById(
      req.params.id
    );

    if (!item) {
      return res.status(404).json({
        message: "Not found"
      });
    }

    res.json(item);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// UPDATE
exports.updateProgress = async (req, res) => {
  try {
    const item = await progressService.update(
      req.params.id,
      req.body
    );

    if (!item) {
      return res.status(404).json({
        message: "Not found"
      });
    }

    res.json(item);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// DELETE
exports.deleteProgress = async (req, res) => {
  try {
    const deleted = await progressService.delete(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        message: "Not found"
      });
    }

    res.json({
      message: "Deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};