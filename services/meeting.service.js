const Meeting = require("../schemas/meeting.schema");

const createMeeting = async (data) => {
  try {
    const document = await Meeting.create(data);
    return document;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { createMeeting };
