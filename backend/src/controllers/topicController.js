const topicService = require("../services/topicService");

// CREATE
exports.createTopic = async (req, res) => {
  try {
    const topic = await topicService.create(req.body);

    res.status(201).json(topic);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// GET ALL
exports.getAllTopics = async (req, res) => {
  try {
    const list = await topicService.getAll();

    res.json(list);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// GET BY ID
exports.getTopicById = async (req, res) => {
  try {
    const topic = await topicService.getById(
      req.params.id
    );

    if (!topic) {
      return res.status(404).json({
        message: "Not found"
      });
    }

    res.json(topic);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// UPDATE
exports.updateTopic = async (req, res) => {
  try {
    const topic = await topicService.update(
      req.params.id,
      req.body
    );

    if (!topic) {
      return res.status(404).json({
        message: "Not found"
      });
    }

    res.json(topic);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// DELETE
exports.deleteTopic = async (req, res) => {
  try {
    const deleted = await topicService.delete(
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