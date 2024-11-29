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
const { kakaoRestApiKey, kakaoRedirectUrl } = require("../consts/kakaoConfig");
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
    await updateUserByEmail(userData);
    await sendMail(email, token, expires);
    return res
      .status(200)
      .json({ isError: false, message: "success to send email" });
  } catch (error) {
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

authController.get("/google-oauth", (_req, res) => {
  const googleOauthEntryUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleOauthRedirectUrl}&response_type=code&scope=email profile`;
  res.redirect(googleOauthEntryUrl);
});

authController.get("/google-oauth-redirect", async (req, res) => {
  try {
    const { code } = req.query;
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
    if (request.status === 200) {
      const { name: username, email, picture: userImage, id } = request.data;
      const existingUser = await findUserByEmail({ email });
      if (!existingUser) {
        await createUser({ id, username, email, userImage });
      }
      const token = jwt.sign({ email }, JWT_SECRET_KEY, {
        expiresIn: 1000 * 60 * 60,
      });
      res.setHeader("token", token);
      res.redirect(
        `http://localhost:5173/login?username=${existingUser.username}&email=${existingUser.email}&id=${existingUser._id}`
      );
    }
  } catch (error) {
    return res.json({ isError: true, message: "Fail to signin with google" });
  }
});

authController.get("/kakao-oauth", (_req, res) => {
  const kakaoOauthEntryUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoRestApiKey}&redirect_uri=${kakaoRedirectUrl}`;
  res.redirect(kakaoOauthEntryUrl);
});

authController.get("/kakao-oauth-redirect", async (req, res) => {
  try {
    const { code } = req.query;
    const requestToken = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      {
        code,
        client_id: kakaoRestApiKey,
        redirect_uri: kakaoRedirectUrl,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );
    const { access_token } = requestToken.data;
    const request = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
    if (request.data) {
      const { id } = request.data;
      const existingUser = await findUserByEmail({
        email: `${request.data.properties.nickname}@kakao.com`,
      });
      if (!existingUser) {
        const { nickname, profile_image: userImage } = request.data.properties;
        await createUser({
          id,
          username: nickname,
          userImage,
          email: `${nickname}@kakao.com`,
        });
      }
      const { username, _id, email } = existingUser;
      const token = jwt.sign(
        { email: `${username}@kakao.com` },
        JWT_SECRET_KEY,
        {
          expiresIn: 1000 * 60 * 60,
        }
      );
      res.setHeader("token", token);
      res.redirect(
        `http://localhost:5173/login?username=${username}&email=${email}&id=${_id}`
      );
    }
  } catch (error) {
    console.log(error);
    return res.json({ isError: true, message: "Fail to signin with kakao" });
  }
});

module.exports = authController;
