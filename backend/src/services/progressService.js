const db = require("../models");
const Progress = db.Progress;

// CREATE
exports.create = async (data) => {
  return await Progress.create(data);
};

// GET ALL
exports.getAll = async () => {
  return await Progress.findAll();
};

// GET BY ID
exports.getById = async (id) => {
  return await Progress.findByPk(id);
};

// UPDATE
exports.update = async (id, data) => {
  const item = await Progress.findByPk(id);

  if (!item) return null;

  await item.update(data);

  return item;
};

// DELETE
exports.delete = async (id) => {
  const item = await Progress.findByPk(id);

  if (!item) return null;

  await item.destroy();

  return true;
};