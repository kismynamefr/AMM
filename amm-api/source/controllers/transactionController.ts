import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import Transaction from "../models/transactionModel";
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
    const dto = new Transaction({
      ...formData,
      ownerBank: removeVietnameseTones(formData.ownerBank).toUpperCase(),
    });
    dto
      .save()
      .then((data) => res.status(200).json({ status: "Success" }))
      .catch((error) => res.status(401).json({ error }));
  } else if (formData.condition === "Buy") {
    const dto = new Transaction(formData);
    dto
      .save()
      .then((data) => res.status(200).json({ status: "Success" }))
      .catch((error) => res.status(401).json({ error }));
  }
};
const GetTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { serial } = req.params;
  const result = await Transaction.findOne({
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
  const result: any = await Transaction.findOne({
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
  const result: any = await Transaction.findOne({
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
    console.log("result check network: ", data);
    if (data.length) {
      await Transaction.updateOne(
        { serial: formValue.serial },
        { txHash: formValue.txHash }
      );
      console.log(`update txHash success ${formValue.serial}`);
      return res.status(200).json({ status: "Success" })
    } else {
      await Transaction.updateOne({ serial: formValue.serial }, { status: "failed" });
      return res.status(200).json({ status: "Error" });
    }
  } else {
    return res.status(500).json({ status: "Error" });
  }
};

const getTransactionSuccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.params;
  const result = await Transaction.find({
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
