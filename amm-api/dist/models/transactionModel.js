"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const collectionSchema = new mongoose_1.Schema({
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
    txHash: { type: String, minlength: 0, maxlength: 66, unique: true },
    status: { type: String, require: true },
    beginTime: { type: Number, require: true },
    lastestTime: { type: Number, require: true },
}, {
    timestamps: true,
    collection: "Transaction",
});
exports.default = mongoose_1.default.model("Transaction", collectionSchema);
