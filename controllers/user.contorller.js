const withAuth = require("../middlewares/auth");
const { findUserById, updateUserById } = require("../services/user.service");

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

module.exports = userController;
