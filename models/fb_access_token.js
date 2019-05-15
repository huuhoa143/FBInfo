"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FbAccessTokenSchema = new Schema({
  fb_id: {
    type: String,
    index: true
  },
  name: {
    type: String
  },
  link: String,
  avatar: String,
  gender: String,
  age_range: Number,
  birthday: Date,
  fb_access_token: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  passwrod: String,
  requests: {
    type: Number,
    default: 0
  },
  cookie: String,
  mobile: String,
  status: String, // die, active
  created_time: Date,
  updated_time: Date
});

FbAccessTokenSchema.statics.findRandToken = function() {
  return this.find({ status: "active" })
    .then(tokens => {
      if (tokens.length > 0) {
        const rand = Math.floor(Math.random() * tokens.length) + 1;
        return Promise.resolve({ ...tokens[rand - 1].toJSON() });
      } else {
        return Promise.resolve();
      }
    })
    .catch(err => {
      console.log(err);
      return Promise.resolve();
    });
};

FbAccessTokenSchema.statics.updateFbAccessToken = function(_id, diff) {
  return this.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(_id)
    },
    {
      $set: diff
    },
    {
      returnNewDocument: true,
      new: true
    }
  );
};

const FbAccessToken = mongoose.model("FbAccessToken", FbAccessTokenSchema);
module.exports = FbAccessToken;
