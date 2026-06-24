const vocabService = require("../services/vocabService");

// CREATE
exports.createVocab = async (req, res) => {
  try {
    const vocab = await vocabService.create(req.body);

    res.status(201).json(vocab);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// GET ALL
exports.getAllVocab = async (req, res) => {
  try {
    const list = await vocabService.getAll();

    res.json(list);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// GET BY ID
exports.getVocabById = async (req, res) => {
  try {
    const item = await vocabService.getById(req.params.id);

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
exports.updateVocab = async (req, res) => {
  try {
    const item = await vocabService.update(
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
exports.deleteVocab = async (req, res) => {
  try {
    const deleted = await vocabService.delete(
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