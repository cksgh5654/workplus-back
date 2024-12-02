require("dotenv").config();

const googleApiKey = process.env.GOOGLE_API_KEY;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSeret = process.env.GOOGLE_CLIENT_SECRET;
const googleOauthSigninRedirectUrl =
  process.env.GOOGLE_OAUTH_SIGNIN_REDIRECT_URL;
const googleOauthSignupRedirectUrl =
  process.env.GOOGLE_OAUTH_SIGNUP_REDIRECT_URL;

module.exports = {
  googleApiKey,
  googleClientId,
  googleClientSeret,
  googleOauthSigninRedirectUrl,
  googleOauthSignupRedirectUrl,
};
