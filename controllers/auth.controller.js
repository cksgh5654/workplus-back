const {
  googleClientId,
  googleOauthRedirectUrl,
  googleClientSeret,
} = require("../consts/googleConfig");
const authController = require("express").Router();
const axios = require("axios");
const {
  findUserById,
  createUser,
  findUserByEmail,
  updateUserByEmail,
} = require("../services/user.service");
const { kakaoRestApiKey, kakaoRedirectUrl } = require("../consts/kakaoConfig");
const crypto = require("crypto");
const { sendMail } = require("../utils/nodmailer.util");

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
    const user = await createUser(userData);
    await sendMail(email, token, expires);

    return res
      .status(200)
      .json({ isError: false, message: "success to send email" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ isError: false, message: "fail to send email" });
  }
});

authController.post("/verify-email", async (req, res) => {
  const { email, token: reqToekn } = req.body;
  console.log;
  try {
    const userFromDB = await findUserByEmail({ email });
    if (!userFromDB) {
      return res
        .status(404)
        .json({ isError: true, message: "유저를 찾을 수 없습니다." });
    }

    if (userFromDB.token.value !== reqToekn.value) {
      return res
        .status(400)
        .json({ isError: true, message: "토큰이 일치 하지 않습니다." });
    }

    if (reqToekn.expires < Date.now()) {
      return res
        .status(400)
        .json({ isError: true, message: "토큰이 만료 되었습니다." });
    }

    await updateUserByEmail({ email, status: true });

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

    return res.status(200).json({ isError: false, message: "로그인 성공" });
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
      const existingUser = await findUserById({ id });
      if (!existingUser) {
        const user = await createUser({ id, username, email, userImage });
      }
      res.redirect("http://localhost:5173");
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
      const existingUser = await findUserById({ id });
      if (!existingUser) {
        const { nickname: username, profile_image: userImage } =
          request.data.properties;
        const user = await createUser({
          id,
          username,
          userImage,
          email: `${username}@kakao.com`,
        });
      }
      res.redirect("http://localhost:5173");
    }
  } catch (error) {
    console.log(error);
    return res.json({ isError: true, message: "Fail to signin with kakao" });
  }
});

module.exports = authController;
