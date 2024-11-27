require("dotenv").config();

const googleApiKey = process.env.GOOGLE_API_KEY;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSeret = process.env.GOOGLE_CLIENT_SECRET;
const googleOauthRedirectUrl = process.env.GOOGLE_OAUTH_REDIRECT_URL;

module.exports = {
  googleApiKey,
  googleClientId,
  googleClientSeret,
  googleOauthRedirectUrl,
};
