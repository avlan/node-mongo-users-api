const Joi = require("joi");

module.exports = {
  create: {
    body: {
      name: Joi.string(),
      username: Joi.string().required(),
      dateOfBirth: Joi.date(),
      address: Joi.string(),
      description: Joi.string(),
    },
  },
  update: {
    body: {
      username: Joi.string(),
      name: Joi.string(),
      dateOfBirth: Joi.date(),
      address: Joi.string(),
      description: Joi.string(),
      createdAt: Joi.date(),
      updatedAt: Joi.date(),
    },
    params: { userId: Joi.string() },
  },
  delete: {
    params: { userId: Joi.string() },
  },
};
