"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = (email, codeMail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const myOAuth2Client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_MAILER_CLIENT_ID, process.env.GOOGLE_MAILER_CLIENT_SECRET);
        myOAuth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
        });
        const myAccessTokenObject = yield myOAuth2Client.getAccessToken();
        const myAccessToken = myAccessTokenObject === null || myAccessTokenObject === void 0 ? void 0 : myAccessTokenObject.token;
        let optionSend = {
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
        const transporter = nodemailer_1.default.createTransport(optionSend);
        // send mail with defined transport object
        yield transporter.sendMail({
            to: `${email}`,
            subject: "MUABANCOIN.COM",
            text: "Email được gửi từ MUABANCOIN.COM",
            html: `<div>
      <p>Xin chào: ${email}</p> <br />
      <li> Mã code của bạn là: ${codeMail} </li> <br />
      <p> Cảm ơn bạn đã đăng ký account tại MUABANCOIN.COM.</p>
      </div>`, // html body
        });
        return true;
    }
    catch (error) {
        return false;
    }
});
exports.default = {
    sendMail,
};
