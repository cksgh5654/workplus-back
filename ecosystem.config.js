module.exports = {
  apps: [
    {
      name: "workplus-back",
      script: "./index.js",
      env: {
        PORT: process.env.PORT,
        MONGO_DB_URL: process.env.MONGO_DB_URL,
        MONGO_DB_COLLECTION: process.env.MONGO_DB_COLLECTION,
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_OAUTH_SIGNIN_REDIRECT_URL:
          process.env.GOOGLE_OAUTH_SIGNIN_REDIRECT_URL,
        GOOGLE_OAUTH_SIGNUP_REDIRECT_URL:
          process.env.GOOGLE_OAUTH_SIGNUP_REDIRECT_URL,
        NODEMAILER_AUTH_EMAIL: process.env.NODEMAILER_AUTH_EMAIL,
        NODEMAILER_AUTH_PASS: process.env.NODEMAILER_AUTH_PASS,
        JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
        FRONT_END_POINT: process.env.FRONT_END_POINT,
        BASE_URL: process.env.BASE_URL,
      },
    },
  ],
};
