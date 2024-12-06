const {
  createVacation,
  findVacationById,
  updateVacationById,
  deleteVacationById,
  findVacationsByUserId,
  findVacationsByDate,
  findVacationsByMonth,
} = require("../services/vacation.service");
const {
  processDateToISODate,
  getMonthStartEndDates,
} = require("../utils/utils");

const vacationController = require("express").Router();

vacationController.get("/:vacationId", async (req, res) => {
  try {
    const {
      _id,
      requesterId,
      username,
      startDate,
      endDate,
      vacationType,
      reason,
    } = await findVacationById(req.params.vacationId);
    return res.status(200).json({
      isError: false,
      data: {
        vacation: {
          id: _id,
          requesterId,
          username,
          startDate,
          endDate,
          vacationType,
          reason,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "휴가 데이터 가져오기 실패" });
  }
});

vacationController.get("/user/:userId", async (req, res) => {
  try {
    const documents = await findVacationsByUserId(req.params.userId);
    const vacations = documents.map(
      ({
        _id,
        requesterId,
        username,
        startDate,
        endDate,
        vacationType,
        reason,
        createdAt,
      }) => ({
        vacationId: _id,
        requesterId,
        username,
        startDate,
        endDate,
        vacationType,
        reason,
        createdAt,
      })
    );
    return res.status(200).json({ isError: false, data: { vacations } });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "휴가 데이터 가져오기 실패" });
  }
});

vacationController.get("/date/:date", async (req, res) => {
  const { date } = req.params;
  if (!date) {
    return res
      .status(400)
      .json({ isError: true, message: "날짜 데이터가 필요합니다." });
  }
  const { startDate, endDate } = processDateToISODate(date);
  try {
    const documets = await findVacationsByDate(startDate, endDate);
    return res.status(200).json({ isError: false, vacations: documets });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "휴가 데이터 가져오기 실패" });
  }
});

vacationController.get("/month/:date", async (req, res) => {
  const { date } = req.params;
  if (!date) {
    return res
      .status(400)
      .json({ isError: true, message: "날자 데이터가 필요합니다." });
  }
  const { startDate, endDate } = getMonthStartEndDates(date);
  try {
    const vacations = await findVacationsByMonth(startDate, endDate);
    res.setHeader("Cache-Control", ["public", `max-age=${60 * 5}`]);
    return res.status(200).json({
      isError: false,
      vacations,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "휴가 데이터 가져오기 실패" });
  }
});

vacationController.post("/", async (req, res) => {
  const { username, startDate, endDate, vacationType, reason, userId } =
    req.body;

  try {
    const _vacation = await createVacation({
      username,
      startDate,
      endDate,
      vacationType,
      reason,
      requesterId: userId,
    });

    return res.status(201).json({ isError: false, message: "휴가 생성 성공" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ isError: true, message: "휴가 생성 실패" });
  }
});

vacationController.put("/:vacationId", async (req, res) => {
  try {
    const updated = await updateVacationById(req.params.vacationId, {
      ...req.body,
    });
    if (!updated) {
      return res
        .status(404)
        .json({ isError: true, message: "잘못된 요청 입니다." });
    }
    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "휴가 정보 수정 실패" });
  }
});

vacationController.delete("/:vacationId", async (req, res) => {
  try {
    const deleted = await deleteVacationById(req.params.vacationId);
    if (!deleted) {
      return res
        .status(404)
        .json({ isError: true, message: "잘못된 요청 입니다." });
    }
    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "휴가 신청 삭제 실패" });
  }
});

module.exports = vacationController;
