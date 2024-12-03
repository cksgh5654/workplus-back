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
      default: "",
    },
    password: {
      type: String,
    },
    userImage: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    birth: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    token: {
      value: { type: String },
      expires: { type: String },
    },
    emailValidationStatus: {
      type: Boolean,
    },
    signupType: {
      type: String,
      enum: ["email", "google"],
    },
    attendance: {
      status: { type: Boolean, default: false },
      timestamps: { type: String, default: "" },
    },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: true,
    },
  }
);

const User = mongoose.model("users", userSchema);
module.exports = User;
