const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
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
