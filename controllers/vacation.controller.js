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
    if (!documents) {
      return res.status(500).json({
        isError: true,
        message: "DB에서 데이터 가져오기를 실패 했습니다.",
      });
    }
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
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "휴가 정보 가져오기 실패" });
  }
});

vacationController.post("/", async (req, res) => {
  const { username, startDate, endDate, vacationType, reason, userId } =
    req.body;

  try {
    const vacation = await createVacation({
      username,
      startDate,
      endDate,
      vacationType,
      reason,
      requesterId: userId,
    });
    if (!vacation) {
      return res.status(500).json({ isError: true, message: "휴가 생성 실패" });
    }
    return res.status(201).json({ isError: false, message: "휴가 생성 성공" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ isError: true, message: error.message });
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
    } = await findVacationById({ id: req.params.vacationId });
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
    return res.status(500).json({ isError: true, message: error.message });
  }
});

vacationController.put("/:vacationId", async (req, res) => {
  const formData = { id: req.params.vacationId, ...req.body };
  try {
    const updated = await updateVacationById(formData);
    if (!updated) {
      return res
        .status(500)
        .json({ isError: true, message: "휴가 업데이트 실패" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ isError: true, message: error.message });
  }
});

vacationController.delete("/:vacationId", async (req, res) => {
  try {
    const deleted = await deleteVacationById({ id: req.params.vacationId });
    if (!deleted) {
      return res.status(500).json({ isError: true, message: "휴가 삭제 실패" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ isError: true, message: error.message });
  }
});

vacationController.get("/user/:userId", async (req, res) => {
  try {
    const documents = await findVacationsByUserId({ id: req.params.userId });
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
    return res.status(500).json({ isError: true, message: error.message });
  }
});

module.exports = vacationController;
