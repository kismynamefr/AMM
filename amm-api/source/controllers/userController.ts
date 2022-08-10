import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import Users from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMailController from "./sendMailController";
dotenv.config();

let RefreshTokenArr: any[] = [];

const generateRandomNumber = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
const RegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const formData = req.body;
    console.log(formData);
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(formData.password, salt);
    const dto = new Users({
      ...formData,
      password: hashed,
    });
    await dto
      .save()
      .then((data) => res.status(200).json({ status: "Success" }))
      .catch((error) =>
        res.status(404).json({ status: "Register failed", error })
      );
  } catch (error) {
    return res.status(500).json(error);
  }
};

const sendMailRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const formData = req.body;
    const codeMail = generateRandomNumber();
    await sendMailController.sendMail(formData.email, codeMail);
    return res
      .status(200)
      .json({ status: "Success", code: codeMail, email: formData.email });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const formData = req.body;
    console.log(formData);
    const userData: any = await Users.findOne({
      username: formData.username,
    });
    if (!userData) return res.status(404).json({ status: "Wrong Username" });
    const result = await bcrypt.compare(formData.password, userData?.password);
    if (!result) return res.status(404).json({ status: "Wrong Password" });
    if (userData && result) {
      const accessToken = generateJWTToken(userData);
      const refreshToken = generateRefreshJWTToken(userData);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      RefreshTokenArr.push(refreshToken);
      const { password, ...otherPassword } = userData._doc;
      return res.status(200).json({ ...otherPassword, accessToken });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

const GetUsers = async (req: Request, res: Response, next: NextFunction) => {
  const user = await Users.find();
  return res.status(200).json({ user });
};
const RefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json("You are not authenticated");
  if (!RefreshTokenArr?.includes(refreshToken))
    return res.status(401).json("Refresh token is not valid");
  jwt.verify(
    refreshToken,
    String(process.env.JWT_REFRESH_KEY),
    (err: any, user: any) => {
      if (err) console.log(err);
      refreshToken = RefreshTokenArr.filter(
        (token: any) => token !== refreshToken
      );
      const newAccessToken = generateJWTToken(user);
      const newRefreshToken = generateRefreshJWTToken(user);
      RefreshTokenArr.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      return res.status(200).json(newAccessToken);
    }
  );
};

const LogoutUser = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("refreshToken");
  RefreshTokenArr = RefreshTokenArr.filter(
    (token: any) => token !== res.cookie["refreshToken"]
  );
  return res.status(200).json("Logged out!");
};

const generateJWTToken = (userData: any) => {
  const accessToken = jwt.sign(
    { id: userData.id, admin: userData.admin },
    String(process.env.JWT_ACCESS_KEY),
    {
      expiresIn: "60s",
    }
  );
  return accessToken;
};
const generateRefreshJWTToken = (userData: any) => {
  const refreshToken = jwt.sign(
    { id: userData.id, admin: userData.admin },
    String(process.env.JWT_REFRESH_KEY),
    {
      expiresIn: "365d",
    }
  );
  return refreshToken;
};

export default {
  RegisterUser,
  LoginUser,
  GetUsers,
  RefreshToken,
  LogoutUser,
  sendMailRegister,
};
