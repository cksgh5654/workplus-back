const Meeting = require("../schemas/meeting.schema");

const createMeeting = async (data) => {
  try {
    const document = await Meeting.create(data);
    return document;
  } catch (error) {
    throw new Error(error);
  }
};

const findMeetingById = async ({ id }) => {
  try {
    const document = await Meeting.findOne({ _id: id });
    return document;
  } catch (error) {
    throw new Error(error);
  }
};

const updateMeetingById = async (data) => {
  const { id, ...rest } = data;
  try {
    const updated = await Meeting.updateOne({ _id: id }, rest);
    return updated;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteMeetingById = async ({ id }) => {
  try {
    const deleted = await Meeting.deleteOne({ _id: id });
    return deleted;
  } catch (error) {
    throw new Error(error);
  }
};

const findMyMeetingByUsername = async ({ username }) => {
  try {
    const documents = await Meeting.find({ attendant: username });
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
};
