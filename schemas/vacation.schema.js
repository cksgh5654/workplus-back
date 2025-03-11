const mongoose = require("../db_init");
const { String, Date } = mongoose.Schema.Types;

const vacationSchema = new mongoose.Schema(
  {
    requesterId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    vacationType: {
      type: String,
      enum: ["연차", "반차"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["대기중", "승인", "거부"],
      default: "대기중",
    },
  },
  {
    timestamps: {
      createdAt: true,
    },
  }
);

const Vacation = mongoose.model("vacations", vacationSchema);
module.exports = Vacation;
