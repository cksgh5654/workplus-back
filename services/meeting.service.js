const Meeting = require("../schemas/meeting.schema");
const { removeUndefinedFields } = require("../utils/utils");

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
    throw new Error("[DB createMeeting] 에러", { cause: error });
  }
};

const findMeeting = async (meetingId, limit) => {
  const query = meetingId ? { _id: { $gt: meetingId } } : {};
  try {
    const documents = await Meeting.find(query) //
      .sort({ _id: 1 })
      .limit(limit);
    return documents;
  } catch (error) {
    throw new Error("findMeeting DB에러", { cause: error });
  }
};

const findMeetingById = async (id) => {
  try {
    const document = await Meeting.findById(id);
    return document;
  } catch (error) {
    throw new Error("[DB findMeetingById] 에러", { cause: error });
  }
};

const updateMeetingById = async (
  id,
  { creatorId, date, startTime, agenda, attendant, username }
) => {
  const filterdObject = removeUndefinedFields({
    id,
    creatorId,
    date,
    startTime,
    agenda,
    attendant,
    checkedBy: [username],
  });
  try {
    const updated = await Meeting.findByIdAndUpdate(id, filterdObject);
    return updated;
  } catch (error) {
    throw new Error("[DB updateMeetingById] 에러", { cause: error });
  }
};

const deleteMeetingById = async (id) => {
  try {
    const deleted = await Meeting.findByIdAndDelete(id);
    return deleted;
  } catch (error) {
    throw new Error("[DB deleteMeetingById] 에러", { cause: error });
  }
};

const findMyMeetingByUsername = async (username) => {
  try {
    const documents = await Meeting.find(
      { attendant: username },
      "_id creatorId attendant date startTime agenda creatorUsername checkedBy"
    ).sort({ date: -1 });
    return documents;
  } catch (error) {
    throw new Error("[DB findMyMeetingByUsername] 에러", { cause: error });
  }
};

const findMeetingByDate = async (startDate, endDate) => {
  try {
    const documents = await Meeting.find({
      date: { $gte: startDate, $lte: endDate },
    });
    return documents;
  } catch (error) {
    throw new Error("[DB findMeetingByDate] 에러", { cause: error });
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
    throw new Error("[DB getAllMeetings] 에러", { cause: error });
  }
};

const findUncheckedMeeting = async (userId) => {
  try {
    const document = await Meeting.findOne({ checkedBy: { $nin: [userId] } });
    return !!document;
  } catch (error) {
    throw new Error("findUncheckedMeetings DB에러", { cause: error });
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
  findMeeting,
  findUncheckedMeeting,
};
