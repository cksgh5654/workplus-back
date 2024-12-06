const {
  getUsers,
  getUsersAttendance,
  deleteUserById,
  getUsersCount,
} = require("../services/user.service");
const {
  updateVacationById,
  findVacations,
  getVacationsCount,
} = require("../services/vacation.service");

const adminController = require("express").Router();
const VACATION_STATUS = ["승인", "거부", "대기중"];

adminController.get("/users", async (req, res) => {
  const { limit = 20, page = 1 } = req.query;
  const currentPage = Number(page);
  try {
    const users = await getUsers(limit, currentPage - 1);
    const totalUserCount = await getUsersCount();
    const totalPage = Math.ceil(totalUserCount / limit);
    const nextPage = currentPage + 1 > totalPage ? null : currentPage + 1;
    const prevPage = currentPage - 1 === 0 ? 0 : currentPage - 1;
    return res.status(200).json({
      isError: false,
      users,
      pageInfo: { totalUserCount, totalPage, currentPage, nextPage, prevPage },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ isError: true, message: "유저 데이터 가져오기 실패" });
  }
});

adminController.get("/vacations", async (req, res) => {
  const { limit = 20, page = 1 } = req.query;
  const currentPage = Number(page);
  try {
    const vacations = await findVacations(limit, currentPage - 1);
    const totalVacationCount = await getVacationsCount();
    const totalPage = Math.ceil(totalVacationCount / limit);
    const nextPage = currentPage + 1 > totalPage ? null : currentPage + 1;
    const prevPage = currentPage - 1 === 0 ? 0 : currentPage - 1;
    return res.status(200).json({
      isError: false,
      vacations,
      pageInfo: {
        totalVacationCount,
        totalPage,
        currentPage,
        nextPage,
        prevPage,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "휴가 데이터 가져오기 실패" });
  }
});

adminController.get("/users/attendance", async (req, res) => {
  const { limit = 20, page = 1 } = req.query;
  const currentPage = Number(page);
  try {
    const users = await getUsersAttendance(limit, currentPage - 1);
    const totalUserCount = await getUsersCount();
    const totalPage = Math.ceil(totalUserCount / limit);
    const nextPage = currentPage + 1 > totalPage ? null : currentPage + 1;
    const prevPage = currentPage - 1 === 0 ? 0 : currentPage - 1;
    return res.status(200).json({
      isError: false,
      users,
      pageInfo: {
        totalUserCount,
        totalPage,
        currentPage,
        nextPage,
        prevPage,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "유저 정보 가져오기 실패" });
  }
});

adminController.patch("/vacation/:vacationId/status", async (req, res) => {
  const { status } = req.body;
  if (!VACATION_STATUS.includes(status)) {
    return res
      .status(400)
      .json({ isError: true, message: "잘못된 요청 상태(status) 입니다" });
  }
  try {
    const updated = await updateVacationById(req.params.vacationId, {
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

adminController.delete("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res
      .status(400)
      .json({ isError: true, message: "유저 정보가 필요합니다." });
  }
  try {
    const deleted = await deleteUserById(userId);
    if (deleted === null) {
      return res
        .status(400)
        .json({ isError: true, message: "잘못된 요청 입니다." });
    }
    return res.status(200).json({ isError: false, message: "유저 삭제 완료" });
  } catch (error) {
    return res
      .status(500)
      .json({ isError: true, message: "유저 정보 삭제 실패" });
  }
});

module.exports = adminController;
