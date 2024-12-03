const Meeting = require("../schemas/meeting.schema");

const createMeeting = async (data) => {
  try {
    const document = await Meeting.create(data);
    return document;
  } catch (error) {
    throw new Error(error);
  }
};

const findMeetingById = async (id) => {
  try {
    const document = await Meeting.findById(id);
    return document;
  } catch (error) {
    throw new Error(error);
  }
};

const updateMeetingById = async ({
  id,
  creatorId,
  data,
  startTime,
  agenda,
  attendant,
}) => {
  try {
    const updated = await Meeting.findByIdAndUpdate(id, {
      creatorId,
      data,
      startTime,
      agenda,
      attendant,
    });
    return updated;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteMeetingById = async (id) => {
  try {
    const deleted = await Meeting.findByIdAndDelete(id);
    return deleted;
  } catch (error) {
    throw new Error(error);
  }
};

const findMyMeetingByUsername = async (username) => {
  try {
    const documents = await Meeting.find({ attendant: username });
    return documents;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllMeetings = async () => {
  try {
    const documents = await Meeting.find();
    return documents;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createMeeting,
  findMeetingById,
  updateMeetingById,
  deleteMeetingById,
  findMyMeetingByUsername,
  getAllMeetings,
};
