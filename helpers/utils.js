const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");

const Joi = require("@hapi/joi");

module.exports = {
  joiValidator: schema => input => {
    const result = Joi.object(schema).validate(input, {
      allowUnknown: false,
      abortEarly: false
    });

    if (result.error) {
      throw new APIError("ValidationError", httpStatus.BAD_REQUEST);
    }

    return result.value;
  }
};
