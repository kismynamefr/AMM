import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import users from "../models/userModel";
dotenv.config();

const RegisterTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const formData = req.body;
  console.log(formData);
  const dto = new users(formData);
  dto
    .save()
    .then((data) => res.status(200).json({ status: "Success" }))
    .catch((error) => res.status(200).json({ status: "Error" }));
};

export default {
    RegisterTransaction,
};
