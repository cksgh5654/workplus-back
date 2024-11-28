const mongoose = require("../db_init");
const { String, Boolean } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    id: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    userImage: {
      type: String,
    },
    phone: {
      type: String,
    },
    birth: {
      type: String,
    },
    address: {
      type: String,
    },
    token: {
      value: { type: String },
      expires: { type: String },
    },
    status: {
      type: Boolean,
    },
  },
  {
    timestamps: {
      createdAt: true,
    },
  }
);

const User = mongoose.model("users", userSchema);
module.exports = User;
