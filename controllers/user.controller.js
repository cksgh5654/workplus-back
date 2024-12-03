const { BASE_URL } = require("../consts/app");
const withAuth = require("../middlewares/auth");
const {
  findUserById,
  updateUserById,
  findUsersByUsername,
} = require("../services/user.service");
const imageUploadMiddleware = require("../utils/imageUpload.util");

const userController = require("express").Router();

userController.get("/profile/:id", withAuth, async (req, res) => {
  try {
    const userInfo = await findUserById(req.params.id);
    const {
      _id: id,
      email,
      username,
      birth,
      phone,
      address,
      userImage,
    } = userInfo;
    return res.status(200).json({
      isError: false,
      data: {
        user: { id, email, username, birth, phone, address, userImage },
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ isError: true, message: "프로필 데이터 가져오기 실패" });
  }
});

userController.patch("/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res
      .status(400)
      .json({ isError: true, message: "유저 아이디가 필요합니다." });
  }
  try {
    const updated = await updateUserById(userId, req.body);
    if (!updated) {
      return res
        .status(404)
        .json({ isError: true, message: "잘못된 요청 입니다." });
    }
    return res.status(200).json({ isError: false, message: "업데이트 완료" });
  } catch (error) {
    return res
      .status(500)
      .json({ isError: true, message: "유저 정보 업데이트 실패" });
  }
});

userController.put(
  "/profile/image/:id",
  withAuth,
  imageUploadMiddleware,
  async (req, res) => {
    const fileName = req.file.filename;
    const url = `/images/${fileName}`;
    try {
      const updated = await updateUserById(req.params.id, { userImage: url });
      if (!updated) {
        return res
          .status(500)
          .json({ isError: true, message: "업데이트 실패" });
      }
      return res
        .status(200)
        .json({ isError: false, data: { imgUrl: `${BASE_URL}/${url}` } });
    } catch (error) {
      return res
        .status(500)
        .json({ isError: false, message: "유저 프로필 변경 실패" });
    }
  }
);

userController.post("/checkin/:userId", async (req, res) => {
  try {
    const document = await findUserById(req.params.userId);
    if (document.attendance.status) {
      return res
        .status(400)
        .json({ isError: true, messsage: "이미 출근 상태 입니다." });
    }
    const now = new Date();
    const attendance = {
      status: true,
      timestamps: now,
    };
    const updated = await updateUserById(req.params.userId, { attendance });
    if (!updated) {
      return res.status(500).json({ isError: true, message: "출근 기록 실패" });
    }
    return res.status(200).json({ isError: false, data: { attendance } });
  } catch (error) {
    return res
      .status(500)
      .json({ isError: true, message: "출근 기록 업데이트 실패" });
  }
});

userController.post("/checkout/:userId", async (req, res) => {
  try {
    const document = await findUserById(req.params.userId);
    if (!document) {
      return res
        .status(400)
        .json({ isError: true, message: "잘못된 유저 정보 요청입니다." });
    }
    if (!document.attendance.status) {
      return res
        .status(400)
        .json({ isError: true, messsage: "이미 퇴근 상태 입니다." });
    }
    const now = new Date();
    const attendance = {
      status: false,
      timestamps: now,
    };
    const updated = await updateUserById(req.params.userId, { attendance });
    if (!updated) {
      return res.status(500).json({ isError: true, message: "퇴근 기록 실패" });
    }
    return res.status(200).json({ isError: false, data: { attendance } });
  } catch (error) {
    return res
      .status(500)
      .json({ isError: true, message: "출근 기록 업데이트 실패" });
  }
});

userController.get("/attendance/:userId", async (req, res) => {
  try {
    if (!req.params.userId) {
      return res
        .status(400)
        .json({ isError: true, message: "유저 아이디가 필요합니다" });
    }
    const { attendance } = await findUserById(req.params.userId);
    return res.json({ isError: false, attendance });
  } catch (error) {
    return res.json({
      isError: true,
      message: "fail to get info from server",
    });
  }
});

userController.get("/search", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res
      .status(400)
      .json({ isError: true, message: "유저이름이 필요합니다." });
  }

  try {
    const users = await findUsersByUsername(username);
    return res.status(200).json({ isError: false, users });
  } catch (error) {
    return res
      .status(500)
      .json({ isError: true, message: "유저 검색에 실패했습니다." });
  }
});

module.exports = userController;
