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
  const emailLink = `http://localhost:5173/signup?email=${email}&token=${token}&expires=${expires}`;
  const mailOptions = {
    from: nodemailerAuthEmail,
    to: email,
    subject: "Verify your email for signup",
    html: `<p>Click the link below to verify your email:</p>
           <a href="${emailLink}">Verify Email</a>`,
  };

  return await transporter.sendMail(mailOptions);
};

const sendMailForPassword = async (email, token, expires) => {
  const emailLink = `http://localhost:5173/reset-password?email=${email}&token=${token}&expires=${expires}`;
  const mailOptions = {
    from: nodemailerAuthEmail,
    to: email,
    subject: "Verify your email , to reset password ",
    html: ` 
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="text-align: center; color: #333;">Reset Your Password</h2>
      <p style="font-size: 16px; color: #555; line-height: 1.6;">
        Hello, <br/>
        We received a request to reset your password. Please verify your email by clicking the button below.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${emailLink}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">Verify Email</a>
      </div>
      <p style="font-size: 14px; color: #777; line-height: 1.6;">
        If you did not request this, please ignore this email. This link will expire in ${new Date(
          Date.now() + 1000 * 60 * 5
        ).toLocaleString()} minutes.
      </p>
    </div>`,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  transporter,
  sendMail,
  sendMailForPassword,
};
