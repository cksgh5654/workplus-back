const { updateVacationById } = require("../services/vacation.service");

const adminController = require("express").Router();
const VACATION_STATUS = ["승인", "거부", "대기중"];

adminController.patch("/vacation/:vacationId/status", async (req, res) => {
  const { status } = req.body;
  if (!VACATION_STATUS.includes(status)) {
    return res
      .status(400)
      .json({ isError: true, message: "잘못된 요청 상태(status) 입니다" });
  }
  try {
    const updated = await updateVacationById({
      id: req.params.vacationId,
      status,
    });
    if (!updated) {
      return res
        .status(404)
        .json({ isError: true, message: "휴가를 찾을 수 없습니다." });
    }

    return res
      .status(200)
      .json({ isError: false, message: "휴가 상태 업데이트 완료" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      isError: false,
      message: "휴가 상태 업데이트 실패",
    });
  }
});

module.exports = adminController;
