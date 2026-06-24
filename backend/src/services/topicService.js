const db = require("../models");
const Topic = db.Topic;

// CREATE
exports.create = async (data) => {
  return await Topic.create(data);
};

// GET ALL
exports.getAll = async () => {
  return await Topic.findAll();
};

// GET BY ID
exports.getById = async (id) => {
  return await Topic.findByPk(id);
};

// UPDATE
exports.update = async (id, data) => {
  const item = await Topic.findByPk(id);

  if (!item) return null;

  await item.update(data);

  return item;
};

// DELETE
exports.delete = async (id) => {
  const item = await Topic.findByPk(id);

  if (!item) return null;

  await item.destroy();

  return true;
};