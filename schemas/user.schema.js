const mongoose = require("../db_init");
const { String } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    email: {
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
