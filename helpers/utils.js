const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");

const validObjectID = new RegExp("^[0-9a-fA-F]{24}$");

module.exports = {
  isObjectID: objectID => validObjectID.test(objectID),
  /* eslint-disable consistent-return */
  isValidObjectID: (userId, next) => {
    if (!validObjectID.test(userId)) {
      return next(new APIError("Not Found", httpStatus.NOT_FOUND));
    }
  }
  /* eslint-enable consistent-return */
};
