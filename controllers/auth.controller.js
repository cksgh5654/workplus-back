const {
  googleClientId,
  googleOauthRedirectUrl,
  googleClientSeret,
} = require("../consts/googleConfig");
const authController = require("express").Router();
const axios = require("axios");
const {
  createUser,
  findUserByEmail,
  updateUserByEmail,
} = require("../services/user.service");
const crypto = require("crypto");
const { sendMail } = require("../utils/nodmailer.util");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../consts/app");

authController.patch("/password", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = crypto
    .createHash("sha512")
    .update(password)
    .digest("base64");

  try {
    const user = await findUserByEmail({ email });
    if (!user) {
      return res
        .status(400)
        .json({ isError: true, message: "이메일을 확인 해주세요." });
    }
    const updated = await updateUserByEmail({
      email,
      password: hashedPassword,
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ isError: true, message: error.message });
  }
});

authController.post("/send-email", async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 5 * 60 * 1000;
  const userData = {
    email,
    token: { value: token, expires },
    status: false,
  };

  try {
    const user = await findUserByEmail({ email });
    if (!user) {
      await createUser(userData);
    }
    if (user && user.status) {
      return res
        .status(400)
        .json({ isError: true, message: "이미 가입된 이메일 입니다." });
    }
    await updateUserByEmail(userData);
    await sendMail(email, token, expires);
    return res
      .status(200)
      .json({ isError: false, message: "success to send email" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: true, message: "fail to send email" });
  }
});

authController.post("/verify-email", async (req, res) => {
  const { email, token: reqToken } = req.body;
  try {
    const userFromDB = await findUserByEmail({ email });
    if (!userFromDB) {
      return res
        .status(404)
        .json({ isError: true, message: "유저를 찾을 수 없습니다." });
    }

    if (userFromDB.token.value !== reqToken.value) {
      return res
        .status(400)
        .json({ isError: true, message: "토큰이 일치 하지 않습니다." });
    }

    if (reqToken.expires < Date.now()) {
      return res
        .status(400)
        .json({ isError: true, message: "토큰이 만료 되었습니다." });
    }

    await updateUserByEmail({
      email,
      status: true,
      token: { value: "", expires: "" },
    });

    return res
      .status(200)
      .json({ isError: false, message: "이메일 인증 성공" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ isError: true, message: error.message });
  }
});

authController.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ isError: true, message: "유저 정보를 확인해주세요." });
  }

  const hashedPassword = crypto
    .createHash("sha512")
    .update(password)
    .digest("base64");

  try {
    const existingUser = await findUserByEmail({ email });
    if (!existingUser || !existingUser.status) {
      return res
        .status(400)
        .json({ isError: true, message: "이메일 인증이 필요합니다." });
    }

    const user = await updateUserByEmail({
      email,
      username,
      password: hashedPassword,
    });
    if (!user) {
      return res
        .status(500)
        .json({ isError: false, message: "회원 가입 실패" });
    }
    return res.status(201).json({ isError: false, message: "회원 가입 성공" });
  } catch (error) {
    return res.json({ isError: true, message: error.message });
  }
});

authController.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = crypto
    .createHash("sha512")
    .update(password)
    .digest("base64");
  try {
    const existingUser = await findUserByEmail({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ isError: false, message: "존재 하지 않는 이메일 입니다." });
    }

    if (existingUser.password !== hashedPassword) {
      return res
        .status(400)
        .json({ isError: false, message: "회원 정보가 잘 못되었습니다." });
    }

    const token = jwt.sign({ email }, JWT_SECRET_KEY, {
      expiresIn: 1000 * 60 * 60,
    });

    const user = {
      email: existingUser.email,
      username: existingUser.username,
      id: existingUser._id,
    };
    res.setHeader("token", token);
    return res.status(200).json({ isError: false, data: { user } });
  } catch (error) {
    return res.json({ isError: true, message: error.message });
  }
});

authController.post("/google-oauth", async (req, res) => {
  try {
    const { code } = req.body;
    const url = `https://oauth2.googleapis.com/token`;
    const requestToken = await axios.post(url, {
      code,
      client_id: googleClientId,
      client_secret: googleClientSeret,
      redirect_uri: googleOauthRedirectUrl,
      grant_type: "authorization_code",
    });
    const { access_token } = requestToken.data;
    const request = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (request.status !== 200) {
      return res
        .status(500)
        .json({ isError: true, message: "구글 oauth erorr" });
    }

    const { name: username, email, picture: userImage, id } = request.data;
    const existingUser = await findUserByEmail({ email });
    if (!existingUser) await createUser({ id, username, email, userImage });

    const token = jwt.sign({ email }, JWT_SECRET_KEY, {
      expiresIn: 1000 * 60 * 60,
    });

    const user = {
      username,
      email,
      id: existingUser._id,
      token,
    };

    return res.status(200).json({
      isError: false,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.json({ isError: true, message: "구글로 회원가입 실패" });
  }
});

module.exports = authController;
