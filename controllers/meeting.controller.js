const {
  createMeeting,
  findMeetingById,
} = require("../services/meeting.service");

const meetingController = require("express").Router();

meetingController.post("/", async (req, res) => {
  try {
    const document = await createMeeting(req.body);
    if (!document) {
      return res.status(500).json({ isError: true, message: "회의 생성 실패" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ isError: true, message: error.message });
  }
});

meetingController.get("/:meetingId", async (req, res) => {
  try {
    const document = await findMeetingById({ id: req.params.meetingId });
    if (!document) {
      return res
        .status(500)
        .json({ isError: true, message: "회의를 찾을 수 없습니다." });
    }
    const {
      _id: meetingId,
      creatorId,
      attendant,
      date,
      startTime,
      agenda,
    } = document;
    return res.status(200).json({
      isError: false,
      data: {
        meeting: { meetingId, creatorId, attendant, date, startTime, agenda },
      },
    });
  } catch (error) {
    return res.status(500).json({ isError: true, message: error.message });
  }
});

module.exports = meetingController;
