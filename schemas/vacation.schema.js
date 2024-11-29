const mongoose = require("../db_init");
const { String } = mongoose.Schema.Types;

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
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    vacationType: {
      type: String,
      required: true,
    },
    reason: {
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

const Vacation = mongoose.model("vacations", vacationSchema);
module.exports = Vacation;
