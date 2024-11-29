const { createMeeting } = require("../services/meeting.service");

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

module.exports = meetingController;
