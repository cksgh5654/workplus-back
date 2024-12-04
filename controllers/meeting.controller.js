const {
  createMeeting,
  findMeetingById,
  updateMeetingById,
  deleteMeetingById,
  findMyMeetingByUsername,
  getAllMeetings,
  findMeetingByDate,
} = require("../services/meeting.service");
const { processDateToISODate } = require("../utils/utils");

const meetingController = require("express").Router();

meetingController.get("/", async (_req, res) => {
  try {
    const documents = await getAllMeetings();
    const meetings = documents.map(
      ({
        _id: meetingId,
        creatorId,
        attendant,
        date,
        startTime,
        agenda,
        createdAt,
      }) => ({
        meetingId,
        creatorId,
        attendant,
        date,
        startTime,
        agenda,
        createdAt,
      })
    );
    return res.status(200).json({ isError: false, meetings });
  } catch (error) {
    return res
      .status(500)
      .json({ isError: false, message: "회의 데이터 가져오기 실패" });
  }
});

meetingController.get("/:meetingId", async (req, res) => {
  try {
    const document = await findMeetingById(req.params.meetingId);
    const {
      _id,
      creatorId,
      creatorUsername,
      attendant,
      date,
      startTime,
      agenda,
    } = document;

    return res.status(200).json({
      isError: false,
      data: {
        meeting: {
          meetingId: _id,
          creatorUsername,
          creatorId,
          attendant,
          date,
          startTime,
          agenda,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ isError: true, message: error.message });
  }
});

meetingController.get("/user/:username", async (req, res) => {
  try {
    const documents = await findMyMeetingByUsername(req.params.username);
    const meetings = documents.map(
      ({
        _id: meetingId,
        creatorId,
        attendant,
        date,
        startTime,
        agenda,
        createdAt,
        updatedAt,
        creatorUsername,
      }) => ({
        meetingId,
        creatorUsername,
        creatorId,
        attendant,
        date,
        startTime,
        agenda,
        createdAt,
        updatedAt,
      })
    );
    return res.status(200).json({
      isError: false,
      data: {
        meetings,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ isError: true, message: "회의 데이터 가져오기 실패" });
  }
});

meetingController.get("/date/:date", async (req, res) => {
  const { date } = req.params;
  if (!date) {
    return res
      .status(400)
      .json({ isError: true, message: "날짜 데이터가 필요합니다." });
  }
  const { startDate, endDate } = processDateToISODate(date);
  try {
    const documets = await findMeetingByDate(startDate, endDate);
    return res.status(200).json({ isError: false, meetings: documets });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "회의 데이터 가져오기 실패" });
  }
});

meetingController.post("/", async (req, res) => {
  try {
    const _document = await createMeeting(req.body);
    return res.status(201).send();
  } catch (error) {
    return res.status(500).json({ isError: true, message: error.message });
  }
});

meetingController.put("/:meetingId", async (req, res) => {
  try {
    const _updated = await updateMeetingById({
      id: req.params.meetingId,
      ...req.body,
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ isError: true, message: error.message });
  }
});

meetingController.delete("/:meetingId", async (req, res) => {
  try {
    const _deleted = await deleteMeetingById(req.params.meetingId);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ isError: true, message: "회의 삭제 실패" });
  }
});

module.exports = meetingController;
