const express = require("express");
const { validateRoute } = require("../helpers/middlewares");
const paramValidation = require("../param_validations/user");
const userCtrl = require("../controllers/user");

const router = express.Router(); // eslint-disable-line new-cap

router
  .route("/")
  /** GET /api/users - get all users */
  .get(userCtrl.readAll)
  /** POST /api/users - Create new user */
  .post(validateRoute(paramValidation.create), userCtrl.create);

router
  .route("/:userId")
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.read)

  /** PUT /api/users/:userId - Update user */
  .put(validateRoute(paramValidation.update), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(validateRoute(paramValidation.delete), userCtrl.delete);

module.exports = router;
