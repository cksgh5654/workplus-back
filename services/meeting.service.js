const Meeting = require("../schemas/meeting.schema");

const createMeeting = async ({
  creatorId,
  attendant,
  date,
  startTime,
  agenda,
  username,
}) => {
  try {
    const document = await Meeting.create({
      creatorId,
      creatorUsername: username,
      attendant,
      date,
      startTime,
      agenda,
    });
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
  date,
  startTime,
  agenda,
  attendant,
}) => {
  try {
    const updated = await Meeting.findByIdAndUpdate(id, {
      creatorId,
      date,
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

const findMeetingByDate = async (startDate, endDate) => {
  try {
    const documents = await Meeting.find({
      date: { $gte: startDate, $lte: endDate },
    });
    return documents;
  } catch (error) {
    throw new Error(error);
  }
};

const findMeetingsByMonth = async (startDate, endDate) => {
  try {
    const documents = await Meeting.find(
      {
        date: { $gte: startDate, $lte: endDate },
      },
      "-__v -updatedAt"
    );
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
  findMeetingByDate,
  findMeetingsByMonth,
};
