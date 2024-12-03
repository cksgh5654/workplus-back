const {
  createVacation,
  findVacationById,
  updateVacationById,
  deleteVacationById,
  findVacationsByUserId,
  getAllVacations,
} = require("../services/vacation.service");

const vacationController = require("express").Router();

vacationController.get("/", async (_req, res) => {
  try {
    const documents = await getAllVacations();
    return res.status(200).json({
      isError: false,
      vacations: documents.map(
        ({
          _id: vacationId,
          requesterId,
          username,
          startDate,
          endDate,
          vacationType,
          reason,
          createdAt,
        }) => ({
          vacationId,
          requesterId,
          username,
          startDate,
          endDate,
          vacationType,
          reason,
          createdAt,
        })
      ),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ isError: true, message: "휴가 정보 가져오기 실패" });
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
    return res.status(500).json({ isError: true, message: "휴가 생성 실패" });
  }
});

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
    return res
      .status(500)
      .json({ isError: true, message: "휴가 데이터 가져오기 실패" });
  }
});

vacationController.put("/:vacationId", async (req, res) => {
  const formData = { id: req.params.vacationId, ...req.body };
  try {
    const updated = await updateVacationById(formData);
    if (!updated) {
      return res
        .status(404)
        .json({ isError: true, message: "잘못된 요청 입니다." });
    }
    return res.status(204).send();
  } catch (error) {
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
    return res
      .status(500)
      .json({ isError: true, message: "휴가 신청 삭제 실패" });
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
    return res
      .status(500)
      .json({ isError: true, message: "휴가 데이터 가져오기 실패" });
  }
});

module.exports = vacationController;
