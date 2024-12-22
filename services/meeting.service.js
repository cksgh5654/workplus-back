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
      .limit(limit)
      .lean();
    return documents;
  } catch (error) {
    throw new Error("findMeeting DB에러", { cause: error });
  }
};

const findMeetingById = async (id) => {
  try {
    const document = await Meeting.findById(id).lean();
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
    const updated = await Meeting.findByIdAndUpdate(id, filterdObject).lean();
    return updated;
  } catch (error) {
    throw new Error("[DB updateMeetingById] 에러", { cause: error });
  }
};

const deleteMeetingById = async (id) => {
  try {
    const deleted = await Meeting.findByIdAndDelete(id).lean();
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
    )
      .sort({ date: -1 })
      .lean();
    return documents;
  } catch (error) {
    throw new Error("[DB findMyMeetingByUsername] 에러", { cause: error });
  }
};

const findMeetingByDate = async (startDate, endDate) => {
  try {
    const documents = await Meeting.find({
      date: { $gte: startDate, $lte: endDate },
    }).lean();
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
    ).lean();
    return documents;
  } catch (error) {
    throw new Error("[DB findMeetingsByMonth] 에러", { cause: error });
  }
};

const findUncheckedMeeting = async (username) => {
  try {
    const document = await Meeting.findOne({
      attendant: username,
      checkedBy: { $nin: [username] },
    }).lean();
    return document ?? false;
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
