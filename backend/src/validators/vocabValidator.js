const Joi = require("joi");

const vocabSchema = Joi.object({
  word: Joi.string().min(1).required(),

  meaning: Joi.string().min(1).required(),

  exampleSentence: Joi.string().allow("", null),

  pronunciation: Joi.string().allow("", null),

  topicId: Joi.number().integer().allow(null).optional()
});

module.exports = vocabSchema;