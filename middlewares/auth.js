const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../consts/app");
const { findUserByEmail } = require("../services/user.service");

const withAuth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ isError: true, message: "헤더에 토큰이 필요합니다." });
  }

  try {
    const { email } = jwt.verify(token, JWT_SECRET_KEY);
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ isError: true, message: "토큰이 올바르지 않습니다." });
    }

    next();
  } catch (error) {
    const { name } = error;
    if (name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ isError: true, message: "토큰이 만료되었습니다." });
    }

    if (name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ isError: true, message: "토큰이 올바르지 않습니다." });
    }

    return res
      .status(500)
      .json({ isError: true, message: "토큰을 가져오지 못했습니다." });
  }
};

module.exports = withAuth;
