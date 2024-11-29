const withAuth = require("../middlewares/auth");
const { findUserById, updateUserById } = require("../services/user.service");
const imageUploadMiddleware = require("../utils/imageUpload.util");

const userController = require("express").Router();

userController.get("/profile/:id", withAuth, async (req, res) => {
  try {
    const userInfo = await findUserById({ id: req.params.id });
    if (!userInfo) {
      return res
        .status(404)
        .json({ isError: true, message: "유저를 찾을 수 없습니다." });
    }
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
    return res.status(500).json({ isError: true, message: error.message });
  }
});

userController.patch("/profile/username", async (req, res) => {
  try {
    const updated = await updateUserById({
      id: req.body.id,
      username: req.body.username,
    });
    if (!updated) {
      return res.status(500).json({ isError: false, message: "업데이트 실패" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ isError: false, message: error.message });
  }
});

userController.patch("/profile/birth", async (req, res) => {
  try {
    const updated = await updateUserById({
      id: req.body.id,
      birth: req.body.birth,
    });
    if (!updated) {
      return res.status(500).json({ isError: false, message: "업데이트 실패" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ isError: false, message: error.message });
  }
});

userController.patch("/profile/phone", async (req, res) => {
  try {
    const updated = await updateUserById({
      id: req.body.id,
      phone: req.body.phone,
    });
    if (!updated) {
      return res.status(500).json({ isError: false, message: "업데이트 실패" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ isError: false, message: error.message });
  }
});

userController.patch("/profile/address", async (req, res) => {
  try {
    const updated = await updateUserById({
      id: req.body.id,
      address: req.body.address,
    });
    if (!updated) {
      return res.status(500).json({ isError: false, message: "업데이트 실패" });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ isError: false, message: error.message });
  }
});

userController.put(
  "/profile/image/:id",
  withAuth,
  imageUploadMiddleware,
  async (req, res) => {
    const fileName = req.file.filename;
    const url = `http://localhost:8080/images/${fileName}`;
    try {
      const updated = await updateUserById({
        id: req.params.id,
        userImage: url,
      });
      if (!updated) {
        return res
          .status(500)
          .json({ isError: true, message: "업데이트 실패" });
      }
      return res.status(200).json({ isError: false, data: { imgUrl: url } });
    } catch (error) {
      return res.status(500).json({ isError: false, message: error.message });
    }
  }
);

userController.post("/checkin/:userId", async (req, res) => {
  try {
    const document = await findUserById({ id: req.params.userId });
    if (document.attendance.status) {
      return res
        .status(400)
        .json({ isError: true, messsage: "이미 출근 상태 입니다." });
    }
    const now = Date.now();
    const attendance = {
      status: true,
      timestamps: now,
    };
    const updated = await updateUserById({ id: req.params.userId, attendance });
    if (!updated) {
      return res.status(500).json({ isError: true, message: "출근 기록 실패" });
    }
    return res.status(200).json({ isError: false, data: { attendance } });
  } catch (error) {
    return res.status(500).json({ isError: true, message: error.message });
  }
});

userController.post("/checkout/:userId", async (req, res) => {
  try {
    const document = await findUserById({ id: req.params.userId });
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
    const now = Date.now();
    const attendance = {
      status: false,
      timestamps: now,
    };
    const updated = await updateUserById({ id: req.params.userId, attendance });
    if (!updated) {
      return res.status(500).json({ isError: true, message: "퇴근 기록 실패" });
    }
    return res.status(200).json({ isError: false, data: { attendance } });
  } catch (error) {
    return res.status(500).json({ isError: true, message: error.message });
  }
});

userController.get("/attendance/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    if (!userId) {
      return res
        .status(400)
        .json({ isError: true, message: "유저 아이디가 필요합니다" });
    }
    const { attendance } = await findUserById({ id: userId });
    return res.json({ isError: false, attendance });
  } catch (error) {
    return res.json({
      isError: true,
      message: "fail to get info from server",
    });
  }
});

module.exports = userController;
