const mongoose = require("../db_init");
const { String } = mongoose.Schema.Types;

const MeetingSchema = new mongoose.Schema(
  {
    creator: {
      type: String,
      required: true,
    },
    attendant: {
      type: [String],
      required: true,
    },
    date: {
      type: String,
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
  },
  {
    timestamps: {
      createdAt: true,
    },
  }
);

const Meeting = mongoose.model("meetings", MeetingSchema);
module.exports = Meeting;
