import { Document } from "mongoose";

export default interface collection extends Document {
    serial: String,
    walletAddress: String,
    network: String,
    typeCoin: String,
    condition: String,
    nameBank: String,
    ownerBank: String,
    accountNumber: String,
    txHash: String,
    amountOut: Number,
    amountIn: Number,
    status: String,
    beginTime: Number,
    lastestTime: Number    
}
