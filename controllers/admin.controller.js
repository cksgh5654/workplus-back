const { updateVacationById } = require("../services/vacation.service");

const adminController = require("express").Router();

adminController.patch("/vacation/:vacationId/confirm", async (req, res) => {
  try {
    const updated = await updateVacationById({
      id: req.params.vacationId,
      status: "승인",
    });
    if (!updated) {
      return res
        .status(404)
        .json({ isError: true, message: "휴가를 찾을 수 없습니다." });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      isError: false,
      message: "휴가 상태 업데이트 실패",
    });
  }
});

adminController.patch("/vacation/:vacationId/refuse", async (req, res) => {
  try {
    const updated = await updateVacationById({
      id: req.params.vacationId,
      status: "거부",
    });
    if (!updated) {
      return res
        .status(404)
        .json({ isError: true, message: "휴가를 찾을 수 없습니다." });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      isError: false,
      message: "휴가 상태 업데이트 실패",
    });
  }
});

module.exports = adminController;
