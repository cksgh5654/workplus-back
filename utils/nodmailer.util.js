const {
  nodemailerAuthEmail,
  nodemailerAuthPass,
} = require("../consts/nodeMailer");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: nodemailerAuthEmail,
    pass: nodemailerAuthPass,
  },
});

const sendMail = async (email, token, expires) => {
  const emailLink = `http://localhost:5173/login?email=${email}&token=${token}&expires=${expires}`;
  const mailOptions = {
    from: nodemailerAuthEmail,
    to: email,
    subject: "Verify your email for signup",
    html: `<p>Click the link below to verify your email:</p>
           <a href="${emailLink}">Verify Email</a>`,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  transporter,
  sendMail,
};
