const mongoose = require("../db_init");
const { String, Date } = mongoose.Schema.Types;

const MeetingSchema = new mongoose.Schema(
  {
    creatorId: {
      type: String,
      required: true,
    },
    creatorUsername: {
      type: String,
      required: true,
    },
    attendant: {
      type: [String],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    agenda: {
      type: String,
      required: true,
    },
    checkedBy: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
    },
  }
);

const Meeting = mongoose.model("meetings", MeetingSchema);
module.exports = Meeting;
