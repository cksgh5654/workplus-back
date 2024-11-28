const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../consts/app");
const { findUserByEmail } = require("../services/user.service");

const withAuth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(400)
      .json({ isError: true, message: "헤더에 토큰이 필요합니다." });
  }
  const { email, exp: expires } = jwt.verify(token, JWT_SECRET_KEY);
  try {
    const user = await findUserByEmail({ email });
    if (!user) {
      return res
        .status(400)
        .json({ isError: true, message: "토큰이 올바르지 않습니다." });
    }

    if (expires < Date.now() / 1000) {
      return res
        .status(400)
        .json({ isError: true, message: "토큰이 만료되었습니다." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ isError: true, message: error.message });
  }
};

module.exports = withAuth;
