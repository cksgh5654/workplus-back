const { createVacation } = require("../services/vacation.service");

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

module.exports = vacationController;
