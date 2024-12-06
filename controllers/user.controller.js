const { BASE_URL } = require("../consts/app");
const withAuth = require("../middlewares/auth");
const {
  findUserById,
  updateUserById,
  findUsersByUsername,
  findUsers,
  getUsersCount,
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
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "프로필 데이터 가져오기 실패" });
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
    console.log(error);
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
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "유저 검색에 실패했습니다." });
  }
});

userController.patch("/:userId/attendance", async (req, res) => {
  const { status } = req.body;
  const { userId } = req.params;
  if (!userId) {
    return res
      .status(400)
      .json({ isError: true, message: "유저 정보가 필요합니다" });
  }
  if (status === null || status === undefined) {
    return res
      .status(400)
      .json({ isError: true, message: "근태 상태가 필요합니다." });
  }
  const attendance = {
    status,
    timestamps: new Date(),
  };
  try {
    const updated = await updateUserById(userId, {
      attendance,
    });
    if (!updated) {
      return res
        .status(400)
        .json({ isError: true, message: "잘못된 정보 요청 입니다." });
    }
    return res.status(200).json({ isError: false, attendance });
  } catch (error) {
    console.log(error);
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
      console.log(error);
      return res
        .status(500)
        .json({ isError: false, message: "유저 프로필 변경 실패" });
    }
  }
);

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
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "유저 정보 업데이트 실패" });
  }
});

module.exports = userController;
