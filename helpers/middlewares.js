const httpStatus = require("http-status");

const config = require("../config");
const APIError = require("../helpers/APIError");
const { joiValidator } = require("./utils");

module.exports = {
  convertToApiError: (err, req, res, next) => {
    if (err instanceof APIError && err.message === "Not found") {
      const unifiedErrorMessage = err.errors
        .map((error) => error.messages.join(". "))
        .join(" and ");
      const error = new APIError(unifiedErrorMessage, err.status, true);
      return next(error);
    }
    if (!(err instanceof APIError)) {
      const apiError = new APIError(err.message, err.status, err.isPublic);
      return next(apiError);
    }
    return next(err);
  },
  notFound: (req, res, next) => {
    const err = new APIError("API not found", httpStatus.NOT_FOUND);
    return next(err);
  },
  /* eslint-disable no-unused-vars */
  addTrace: (err, req, res, next) =>
    res.status(err.status || 500).json({
      message: err.isPublic ? err.message : httpStatus[err.status],
      stack: config.env !== "test" ? err.stack : {},
    }),
  /* eslint-enable no-unused-vars */
  validateRoute: (schema) => {
    const validator = joiValidator({
      query: {},
      params: {},
      body: {},
      ...schema,
    });

    return (req, res, next) => {
      const { body, params, query } = req;
      try {
        const result = validator({ body, params, query });
        req.params = result.params;
        req.query = result.query;
        req.body = result.body;
        return next();
      } catch (error) {
        return next(error);
      }
    };
  },
};
