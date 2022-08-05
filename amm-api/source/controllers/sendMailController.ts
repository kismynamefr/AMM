import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";

interface Options {
  service?: string | any;
  auth?: any;
}

const sendMail = async (email: String, codeMail: Number) => {
  try {
    const myOAuth2Client = new OAuth2Client(
      process.env.GOOGLE_MAILER_CLIENT_ID,
      process.env.GOOGLE_MAILER_CLIENT_SECRET
    );
    myOAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
    });
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;
    let optionSend: Options = {
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.ADMIN_EMAIL_ADDRESS,
        clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
        clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken,
      },
    };
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport(optionSend);

    // send mail with defined transport object
    await transporter.sendMail({
      to: `${email}`, // list of receivers
      subject: "MUABANCOIN.COM", // Subject line
      text: "Email được gửi từ MUABANCOIN.COM", // plain text body
      html: `<div>
      <p>Xin chào: ${email}</p> <br />
      <li> Mã code của bạn là: ${codeMail} </li> <br />
      <p> Cảm ơn bạn đã đăng ký account tại MUABANCOIN.COM.</p>
      </div>`, // html body
    });
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  sendMail,
};
