const {
  googleClientId,
  googleOauthRedirectUrl,
  googleClientSeret,
} = require("../consts/googleConfig");
const authController = require("express").Router();
const axios = require("axios");
const { findUserById, createUser } = require("../services/user.service");

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

module.exports = authController;
