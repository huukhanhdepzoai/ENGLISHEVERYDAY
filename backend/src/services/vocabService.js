const db = require("../models");
const Vocabulary = db.Vocabulary;

exports.create = async (data) => {
  return await Vocabulary.create(data);
};

exports.getAll = async () => {
  return await Vocabulary.findAll();
};

exports.getById = async (id) => {
  return await Vocabulary.findByPk(id);
};

exports.update = async (id, data) => {
  const item = await Vocabulary.findByPk(id);

  if (!item) return null;

  await item.update(data);
  return item;
};

exports.delete = async (id) => {
  const item = await Vocabulary.findByPk(id);

  if (!item) return null;

  await item.destroy();
  return true;
};