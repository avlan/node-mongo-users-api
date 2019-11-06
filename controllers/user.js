const httpStatus = require('http-status');
const User = require('../models/user');
const APIError = require('../helpers/APIError');
const utils = require('../helpers/utils');

const UserController = {
  readAll(req, res, next) {
    const filter = req.query.filter || {};
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit, 10) : 10;
    const page = req.query.page !== undefined ? parseInt(req.query.page, 10) : 1;
    const offset = (page - 1) * limit;
    return User.find(filter)
      .skip(offset)
      .limit(limit)
      .then((users) => res.json({
        users,
        page,
        count: users.length,
        limit
      }))
      .catch(next);
  },
  create(req, res, next) {
    return User.create(req.body)
      .then((newUser) => res.status(httpStatus.CREATED).json(newUser))
      .catch(next);
  },
  read(req, res, next) {
    const { userId } = req.params;
    utils.isValidObjectID(userId, next);
    return User.findOne({ _id: userId })
      .then((user) => {
        if (!user) {
          return next(new APIError('Not Found', httpStatus.NOT_FOUND));
        }
        return res.json(user);
      })
      .catch(next);
  },
  update(req, res, next) {
    const { userId } = req.params;
    utils.isValidObjectID(userId, next);
    return User.findByIdAndUpdate(
      { _id: userId },
      { $set: req.body },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return next(new APIError('Not Found', httpStatus.NOT_FOUND));
        }
        return res.json(user);
      })
      .catch(next);
  },
  delete(req, res, next) {
    const { userId } = req.params;
    utils.isValidObjectID(userId, next);
    return User.findOneAndRemove({ _id: userId })
      .then((user) => {
        if (!user) {
          return next(new APIError('Not Found', httpStatus.NOT_FOUND));
        }
        return res.json(user);
      })
      .catch(next);
  }
};

module.exports = UserController;
