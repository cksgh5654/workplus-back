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
const {
  sendMailForPassword,
  sendMailForSignup,
} = require("../utils/nodmailer.util");
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
    if (user && user.status === false) {
      return res
        .status(400)
        .json({ isError: true, message: "이메일 인증을 완료해 주세요" });
    }
    const updated = await updateUserByEmail({
      email,
      password: hashedPassword,
    });
    if (!updated) {
      return res
        .status(500)
        .status({ isError: true, message: "비밀번호 변경 실패" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ isError: true, message: error.message });
  }
});

authController.post("/send-email", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ isError: true, message: "이메일 필요합니다." });
  }
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 5 * 60 * 1000;

  try {
    const user = await findUserByEmail({ email });
    if (!user) await createUser({ email });
    else {
      if (user.signupType) {
        return res
          .status(400)
          .json({ isError: true, message: "이미 가입된 이메일 입니다." });
      }
    }
    await updateUserByEmail({
      email,
      token: { value: token, expires },
      emailValidationStatus: false,
    });
    await sendMailForSignup(email, token, expires);
    return res
      .status(200)
      .json({ isError: false, message: "이메일 보내기 성공" });
  } catch (error) {
    return res
      .status(500)
      .json({ isError: true, message: "이메일 보내기 실패" });
  }
});

authController.post("/send-email-password", async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 5 * 60 * 1000;
  if (!email) {
    return res
      .status(400)
      .json({ isError: true, message: "이메일이 필요합니다" });
  }

  try {
    const existingUser = await findUserByEmail({ email });
    if (!existingUser)
      return res
        .status(400)
        .json({ isError: true, message: "가입된 이메일 계정이 아닙니다." });

    await updateUserByEmail({
      email,
      token: { value: token, expires },
      status: false,
    });
    await sendMailForPassword(email, token, expires);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ isError: true, message: "이메일 전송 실패" });
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
      emailValidationStatus: true,
      token: { value: "", expires: "" },
    });

    return res
      .status(200)
      .json({ isError: false, message: "이메일 인증 성공" });
  } catch (error) {
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
    if (existingUser) {
      if (existingUser.signupType) {
        return res.status(400).json({
          isError: false,
          message: "이미 회원가입된 이메일입니다.",
        });
      }

      if (!existingUser.emailValidationStatus) {
        return res
          .status(400)
          .json({ isError: true, message: "이메일 인증이 필요합니다." });
      }
    }

    const user = await updateUserByEmail({
      email,
      username,
      password: hashedPassword,
      signupType: "email",
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
  if (!email || !password) {
    return res
      .status(400)
      .json({ isError: true, message: "email, password가 필요합니다." });
  }
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

    if (!existingUser.password && !existingUser.username) {
      return res
        .status(400)
        .json({ isError: false, message: "가입되어 있지 않은 이메일 입니다." });
    }

    if (existingUser.signupType !== "email") {
      return res
        .status(400)
        .json({ isError: false, message: "잘못된 로그인 방식 입니다." });
    }

    if (existingUser.password !== hashedPassword) {
      return res
        .status(400)
        .json({ isError: false, message: "회원 정보가 잘못되었습니다." });
    }

    const token = jwt.sign({ email }, JWT_SECRET_KEY, {
      expiresIn: 1000 * 60 * 60,
    });

    const userData = {
      email: existingUser.email,
      username: existingUser.username,
      id: existingUser._id,
      token,
    };
    res.setHeader("token", token);
    return res.status(200).json({ isError: false, data: { user: userData } });
  } catch (error) {
    return res.json({ isError: true, message: error.message });
  }
});

authController.post("/google-oauth-signin", async (req, res) => {
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
    const { email } = request.data;
    const user = await findUserByEmail({ email });
    console.log({ user });
    if (!user) {
      return res
        .status(400)
        .json({ isError: true, message: "가입되어 있지 않은 이메일 입니다." });
    } else {
      if (!user.signupType) {
        return res.status(400).json({
          isError: true,
          message: "가입되어 있지 않은 이메일 입니다.",
        });
      }
      if (user.signupType !== "google") {
        return res
          .status(400)
          .json({ isError: true, message: "잘못된 로그인 타입 입니다." });
      }
    }

    const token = jwt.sign({ email }, JWT_SECRET_KEY, {
      expiresIn: 1000 * 60 * 60,
    });

    const userData = {
      username: user.username,
      email,
      token,
      userId: user._id,
    };
    return res.json({ isError: false, user: userData });
  } catch (error) {
    console.log(error);
    return res.json({ isError: true, message: "구글로 회원가입 실패" });
  }
});

authController.post("/google-oauth-signup", async (req, res) => {
  try {
    const { code } = req.body;
    const url = `https://oauth2.googleapis.com/token`;
    const requestToken = await axios.post(url, {
      code,
      client_id: googleClientId,
      client_secret: googleClientSeret,
      redirect_uri: "http://localhost:5173/signup",
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
    const { name: username, email, picture: userImage } = request.data;
    const user = await findUserByEmail({ email });
    if (user && user.signupType) {
      return res
        .status(400)
        .json({ isError: true, message: "이미 가입된 이메일 계정 입니다." });
    }
    if (user && !user.signupType) {
      await updateUserByEmail({
        username,
        email,
        userImage,
        emailValidationStatus: true,
        signupType: "google",
      });
      return res
        .status(200)
        .json({ isError: false, message: "회원 가입 완료" });
    }

    await createUser({
      username,
      email,
      userImage,
      emailValidationStatus: true,
      signupType: "google",
    });
    return res.status(200).json({ isError: false, message: "회원 가입 완료" });
  } catch (error) {
    console.log(error);
    return res.json({ isError: true, message: "구글로 회원가입 실패" });
  }
});

module.exports = authController;
