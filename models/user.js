const mongoose = require('mongoose');

const Schema = mongoose.Schema; // eslint-disable-line prefer-destructuring

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - username
 *     properties:
 *       name:
 *         type: string
 *       dateOfBirth:
 *         type: string
 *         format: date-time
 *       address:
 *         type: string
 *       description:
 *         type: string
 *       createdAt:
 *         type: string
 *         format: date-time
 *       updatedAt:
 *         type: string
 *         format: date-time
 *       username:
 *         type: string
 */
const UserSchema = new Schema(
  {
    name: {
      type: String
    },
    dateOfBirth: {
      type: Date
    },
    address: {
      type: String
    },
    description: {
      type: String
    },
    username: {
      type: String,
      required: true
    }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('User', UserSchema);
