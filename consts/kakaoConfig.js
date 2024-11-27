require("dotenv").config();

const kakaoRestApiKey = process.env.KAKAO_OAUTH_REST_API_KEY;
const kakaoRedirectUrl = process.env.KAKAO_REDIRECT_URL;

module.exports = {
  kakaoRestApiKey,
  kakaoRedirectUrl,
};
