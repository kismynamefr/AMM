import mongoose, { Schema } from "mongoose";
import collection from "../interfaces/transactionInterfaces";

const collectionSchema: Schema = new Schema(
  {
    serial: { type: String, minlength: 10, maxlength: 10, unique: true },
    walletAddress: { type: String, minlength: 42, maxlength: 42 },
    network: { type: String, require: true },
    typeCoin: { type: String, require: true },
    condition: { type: String, require: true },
    amountOut: { type: Number, require: true },
    amountIn: { type: Number, require: true },
    nameBank: { type: String },
    ownerBank: { type: String },
    accountNumber: { type: String },
    txHash: { type: String, minlength: 66, maxlength: 66, unique: true },
    status: { type: String, require: true },
    beginTime: { type: Number, require: true },
    lastestTime: { type: Number, require: true },
  },
  {
    timestamps: true,
    collection: "Transaction",
  }
);

export default mongoose.model<collection>("Transaction", collectionSchema);
