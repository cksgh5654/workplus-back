require("dotenv").config();

const nodemailerAuthEmail = process.env.NODEMAILER_AUTH_EMAIL;
const nodemailerAuthPass = process.env.NODEMAILER_AUTH_PASS;

module.exports = {
  nodemailerAuthEmail,
  nodemailerAuthPass,
};
