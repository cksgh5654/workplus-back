const {
  createMeeting,
  findMeetingById,
  updateMeetingById,
  deleteMeetingById,
  findMyMeetingByUsername,
  findMeetingByDate,
  findMeetingsByMonth,
  findMeeting,
  findUncheckedMeeting,
} = require("../services/meeting.service");
const {
  processDateToISODate,
  getMonthStartEndDates,
} = require("../utils/utils");

const meetingController = require("express").Router();

meetingController.get("/", async (req, res) => {
  const { nextCursor: meetingId, limit = 20 } = req.query;
  try {
    const meetings = await findMeeting(meetingId, limit);
    const nextCursor = meetings[meetings.length - 1]._id;
    return res.status(200).json({ isError: false, meetings, nextCursor });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "회의 데이터 가져오기 실패" });
  }
});

meetingController.get("/:meetingId", async (req, res) => {
  try {
    const document = await findMeetingById(req.params.meetingId);
    if (document === null) {
      return res
        .status(400)
        .json({ isError: true, message: "잘못된 회의 데이터 요청 입니다." });
    }
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
    const meetings = await findMyMeetingByUsername(req.params.username);
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

meetingController.get("/my/unchecked/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const unCheckedMeeting = await findUncheckedMeeting(username);
    return res.status(200).json({ isError: false, unCheckedMeeting });
  } catch (error) {
    return res
      .status(500)
      .json({ isError: true, message: "미팅 알림 데이터 가져오기 실패" });
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

meetingController.get("/month/:date", async (req, res) => {
  const { date } = req.params;
  if (!date) {
    return res
      .status(400)
      .json({ isError: true, message: "날짜 데이터가 필요 합니다." });
  }
  const { startDate, endDate } = getMonthStartEndDates(date);
  try {
    const meetings = await findMeetingsByMonth(startDate, endDate);
    res.setHeader("Cache-Control", ["public", `max-age=${60 * 5}`]);
    return res.status(200).json({ isError: false, meetings });
  } catch (error) {
    return res
      .status(500)
      .json({ isError: false, message: "회의 데이터 가져오기 실패" });
  }
});

meetingController.post("/", async (req, res) => {
  const { creatorId, attendant, date, startTime, agenda, username } = req.body;
  if (!creatorId || !attendant || !date || !startTime || !agenda || !username) {
    return res
      .status(400)
      .json({ isError: true, message: "유저 정보가 부족합니다." });
  }
  try {
    const _document = await createMeeting(req.body);
    return res.status(201).send();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "회의 생성중 문제가 발생했습니다." });
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
    return res
      .status(500)
      .json({ isError: true, message: "미팅 데이터 업데이트 실패" });
  }
});

meetingController.patch("/check/:username/:meetingId", async (req, res) => {
  const { username, meetingId } = req.params;
  if (!username || !meetingId) {
    return res
      .status(400)
      .json({ isError: true, message: "데이터 정보가 필요합니다." });
  }
  try {
    const updated = await updateMeetingById(meetingId, { username });
    if (!updated) {
      return res
        .status(400)
        .json({ isError: true, message: "잘못된 정보 요청입니다." });
    }
    return res.status(200).json({ isError: false, message: "회의 체크 성공" });
  } catch (error) {
    return res.status(500).json({ isError: true, message: "회의 체크 실패" });
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
