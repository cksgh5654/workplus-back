const mongoose = require("../db_init");
const { String } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
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
  },
  {
    timestamps: {
      createdAt: true,
    },
  }
);

const User = mongoose.model("users", userSchema);
module.exports = User;
