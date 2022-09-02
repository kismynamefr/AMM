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
const dotenv_1 = __importDefault(require("dotenv"));
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
const handleOwnerbank_1 = require("./handleOwnerbank");
const handleTransactionHash_1 = require("./handleTransactionHash");
dotenv_1.default.config();
const SaveTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const formData = req.body;
    console.log(formData);
    if (formData.condition === "Sell") {
        const dto = new transactionModel_1.default(Object.assign(Object.assign({}, formData), { ownerBank: (0, handleOwnerbank_1.removeVietnameseTones)(formData.ownerBank).toUpperCase() }));
        dto
            .save()
            .then((data) => res.status(200).json({ status: "Success" }))
            .catch((error) => res.status(401).json({ error }));
    }
    else if (formData.condition === "Buy") {
        const dto = new transactionModel_1.default(formData);
        dto
            .save()
            .then((data) => res.status(200).json({ status: "Success" }))
            .catch((error) => res.status(401).json({ error }));
    }
});
const GetTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { serial } = req.params;
    const result = yield transactionModel_1.default.findOne({
        serial: serial,
    });
    return result
        ? res.status(200).json({ result, status: "Success" })
        : res.status(200).json({ status: "Error" });
});
const GetTransactionHash = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { serial } = req.params;
    const result = yield transactionModel_1.default.findOne({
        serial: serial,
    });
    if ((result === null || result === void 0 ? void 0 : result.condition) === "Sell") {
        return result
            ? res.status(200).json({ result, status: "Success" })
            : res.status(200).json({ status: "Error" });
    }
    else {
        return res.status(200).json({ status: "Error" });
    }
});
const HandleTransactionHash = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const formValue = req.body;
    console.log("form post: ", req.body);
    const result = yield transactionModel_1.default.findOne({
        serial: formValue.serial,
    });
    if ((result === null || result === void 0 ? void 0 : result.condition) === "Sell" &&
        (result === null || result === void 0 ? void 0 : result.status) === "pending" &&
        (result === null || result === void 0 ? void 0 : result.txHash.length) === 0) {
        const data = yield (0, handleTransactionHash_1.checkNetwork)(result === null || result === void 0 ? void 0 : result.network, formValue.txHash, result === null || result === void 0 ? void 0 : result.typeCoin, result === null || result === void 0 ? void 0 : result.beginTime, result === null || result === void 0 ? void 0 : result.amountIn);
        console.log("result check network: ", data);
        if (data.length) {
            yield transactionModel_1.default.updateOne({ serial: formValue.serial }, { txHash: formValue.txHash });
            console.log(`update txHash success ${formValue.serial}`);
            return res.status(200).json({ status: "Success" });
        }
        else {
            yield transactionModel_1.default.updateOne({ serial: formValue.serial }, { status: "failed" });
            return res.status(200).json({ status: "Error" });
        }
    }
    else {
        return res.status(500).json({ status: "Error" });
    }
});
const getTransactionSuccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.params;
    const result = yield transactionModel_1.default.find({
        status: status,
    });
    return result
        ? res.status(200).json({ result })
        : res.status(200).json({ status: "Error" });
});
exports.default = {
    SaveTransaction,
    GetTransaction,
    GetTransactionHash,
    getTransactionSuccess,
    HandleTransactionHash,
};
