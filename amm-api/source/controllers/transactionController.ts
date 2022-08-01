import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import users from "../models/transactionModel";
import { removeVietnameseTones } from "./handleOwnerbank";
import { checkNetwork } from "./handleTransactionHash";
dotenv.config();

const SaveTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const formData = req.body;
  console.log(formData);
  if (formData.condition === "Sell") {
    const dto = new users({
      ...formData,
      ownerBank: removeVietnameseTones(formData.ownerBank).toUpperCase(),
    });
    dto
      .save()
      .then((data) => res.status(200).json({ status: "Success" }))
      .catch((error) => res.status(200).json({ status: "Error" }));
  } else if (formData.condition === "Buy") {
    const dto = new users(formData);
    dto
      .save()
      .then((data) => res.status(200).json({ status: "Success" }))
      .catch((error) => res.status(200).json({ status: "Error" }));
  }
};
const GetTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { serial } = req.params;
  const result = await users.findOne({
    serial: serial,
  });
  return result
    ? res.status(200).json({ result, status: "Success" })
    : res.status(200).json({ status: "Error" });
};

const GetTransactionHash = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { serial } = req.params;
  const result: any = await users.findOne({
    serial: serial,
  });
  if (result?.condition === "Sell") {
    return result
      ? res.status(200).json({ result, status: "Success" })
      : res.status(200).json({ status: "Error" });
  } else {
    return res.status(200).json({ status: "Error" });
  }
};

const HandleTransactionHash = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const formValue = req.body;
  console.log("form post: ", req.body);
  const result: any = await users.findOne({
    serial: formValue.serial,
  });
  if (
    result?.condition === "Sell" &&
    result?.status === "pending" &&
    result?.txHash.length === 0
  ) {
    const data = await checkNetwork(
      result?.network,
      formValue.txHash,
      result?.typeCoin,
      result?.beginTime,
      result?.amountIn
    );
    console.log("result: ", data);
    if (data) {
      await users.updateOne(
        { serial: formValue.serial },
        { txHash: formValue.txHash }
      );
      console.log(`update txHash success ${formValue.serial}`);
    }
    return data
      ? res.status(200).json({ status: "Success" })
      : res.status(200).json({ status: "Error" });
  } else {
    return res.status(200).json({ status: "Error" });
  }
};

const getTransactionSuccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.params;
  const result = await users.find({
    status: status,
  });
  return result
    ? res.status(200).json({ result })
    : res.status(200).json({ status: "Error" });
};

export default {
  SaveTransaction,
  GetTransaction,
  GetTransactionHash,
  getTransactionSuccess,
  HandleTransactionHash,
};
