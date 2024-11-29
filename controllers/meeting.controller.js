const {
  createMeeting,
  findMeetingById,
  updateMeetingById,
  deleteMeetingById,
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

meetingController.put("/:meetingId", async (req, res) => {
  try {
    const updated = await updateMeetingById({
      id: req.params.meetingId,
      ...req.body,
    });
    if (!updated) {
      return res
        .status(500)
        .json({ isError: true, message: "회의 업데이트 실패" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ isError: true, message: error.message });
  }
});

meetingController.delete("/:meetingId", async (req, res) => {
  try {
    const deleted = await deleteMeetingById({ id: req.params.meetingId });
    if (!deleted) {
      return res.status(500).json({ isError: true, message: "회의 삭제 실패" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ isError: true, message: error.message });
  }
});

module.exports = meetingController;
