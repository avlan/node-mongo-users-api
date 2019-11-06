const httpStatus = require('http-status');
const User = require('../models/user');
const APIError = require('../helpers/APIError');
const utils = require('../helpers/utils');

const UserController = {
  /**
  * @swagger
  * /users:
  *   get:
  *     tags:
  *       - Users
  *     description: Returns all users
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: limit
  *         description: Return limit
  *         in: query
  *         required: false
  *         type: integer
  *       - name: page
  *         description: Return page
  *         in: query
  *         required: false
  *         type: integer
  *       - name: filter[name]
  *         description: Filter by name
  *         in: query
  *         required: false
  *         type: string
  *       - name: filter[dateOfBirth]
  *         description: Filter by date of birth
  *         in: query
  *         required: false
  *         type: string
  *       - name: filter[address]
  *         description: Filter by address
  *         in: query
  *         required: false
  *         type: string
  *       - name: filter[description]
  *         description: Filter by description
  *         in: query
  *         required: false
  *         type: string
  *       - name: filter[username]
  *         description: Filter by username
  *         in: query
  *         required: false
  *         type: string
  *     responses:
  *       200:
  *         description: An array of users
  *         schema:
  *           properties:
  *             docs:
  *               type: array
  *               items:
  *                 allOf:
  *                   - $ref: '#/definitions/User'
  *             count:
  *               type: integer
  *             limit:
  *               type: integer
  *             page:
  *               type: integer
  */
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
        limit,
      }))
      .catch(next);
  },
  /**
  * @swagger
  * /users:
  *   post:
  *     tags:
  *       - Users
  *     description: Creates an user
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: user
  *         description: User object
  *         in: body
  *         required: true
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  *              - properties:
  *                  name:
  *                    type: string
  *                  dateOfBirth:
  *                    type: string
  *                    format: date-time
  *                  address:
  *                    type: string
  *                  description:
  *                    type: string
  *                  username:
  *                    type: string
  *                required:
  *                  - username
  *     responses:
  *       200:
  *         description: Successfully created
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  */
  create(req, res, next) {
    User.create(req.body)
      .then((newUser) => res.status(httpStatus.CREATED).json(newUser))
      .catch(next);
  },
  /**
  * @swagger
  * /users/{userId}:
  *   get:
  *     tags:
  *       - Users
  *     description: Return the details of the user
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: userId
  *         description: Users' id
  *         in: path
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: The user
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  */
  read(req, res, next) {
    const { userId } = req.params;
    utils.isValidObjectID(userId, next);
    User.findOne({ _id: userId })
      .then((user) => {
        if (!user) {
          return next(new APIError(
            'Not Found',
            httpStatus.NOT_FOUND
          ));
        }
        return res.json(user);
      })
      .catch(next);
  },
  /**
  * @swagger
  * /users/{userId}:
  *   put:
  *     tags:
  *       - Users
  *     description: Updates an user
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: user
  *         description: User object
  *         in: body
  *         required: true
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  *              - properties:
  *                  name:
  *                    type: string
  *                  dateOfBirth:
  *                    type: string
  *                    format: date-time
  *                  address:
  *                    type: string
  *                  description:
  *                    type: string
  *                  username:
  *                    type: string
  *                required:
  *                  - username
  *       - name: userId
  *         description: Users' id
  *         in: path
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Successfully updated
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  */
  update(req, res, next) {
    const { userId } = req.params;
    utils.isValidObjectID(userId, next);
    User.findByIdAndUpdate({ _id: userId }, { $set: req.body }, { new: true })
      .then((user) => {
        if (!user) {
          return next(new APIError(
            'Not Found',
            httpStatus.NOT_FOUND
          ));
        }
        return res.json(user);
      })
      .catch(next);
  },
  /**
  * @swagger
  * /users/{userId}:
  *   delete:
  *     tags:
  *       - Users
  *     description: Deletes an user
  *     produces:
  *       - application/json
  *     parameters:
  *       - name: userId
  *         description: Users' id
  *         in: path
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Successfully deleted
  *         schema:
  *           allOf:
  *              - $ref: '#/definitions/User'
  */
  delete(req, res, next) {
    const { userId } = req.params;
    utils.isValidObjectID(userId, next);
    User.findOneAndRemove({ _id: userId })
      .then((user) => {
        if (!user) {
          return next(new APIError(
            'Not Found',
            httpStatus.NOT_FOUND
          ));
        }
        return res.json(user);
      })
      .catch(next);
  },
};

module.exports = UserController;
