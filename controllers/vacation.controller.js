const {
  createVacation,
  findVacationById,
  updateVacationById,
} = require("../services/vacation.service");

const vacationController = require("express").Router();

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
    return res.status(500).json({ isError: true, message: error.message });
  }
});

vacationController.get("/:vacationId", async (req, res) => {
  try {
    const { _id, requesterId, username, startDate, endDate, vacationType } =
      await findVacationById({ id: req.params.vacationId });
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

module.exports = vacationController;
