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
const axios_1 = __importDefault(require("axios"));
const bn_js_1 = __importDefault(require("bn.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const web3_1 = __importDefault(require("web3"));
const Tether_1 = require("../abi/Tether");
const transactionModel_1 = __importDefault(require("../models/transactionModel"));
dotenv_1.default.config();
const sendEther = (network, typeCoin, walletAddress, amountOut) => __awaiter(void 0, void 0, void 0, function* () {
    switch (typeCoin) {
        case "USDT":
            switch (network) {
                case "Ethereum":
                    yield sendTrx(walletAddress, amountOut, process.env.ROPSTEN_INFURA_KEY, Tether_1.USDT_ETH_ABI, Tether_1.USDT_ETH_ADDRESS, 6);
                    break;
                case "Binance":
                    yield sendTrx(walletAddress, amountOut, process.env.QUICKNODE_BSC_TESTNET, Tether_1.USDT_BSC_ABI, Tether_1.USDT_BSC_ADDRESS, 18);
                    break;
                default:
                    break;
            }
            break;
        case "BUSD":
            yield sendTrx(walletAddress, amountOut, process.env.QUICKNODE_BSC_TESTNET, Tether_1.BUSD_BSC_ABI, Tether_1.BUSD_BSC_TESTNET_ADDRESS, 18);
            break;
        case "DAI":
            yield sendTrx(walletAddress, amountOut, process.env.QUICKNODE_BSC_TESTNET, Tether_1.DAI_BSC_ABI, Tether_1.DAI_BSC_ADDRESS, 18);
            break;
        default:
            break;
    }
});
const convertNumber = (amount, decimals) => {
    const amountToken = (Number(amount) * Math.pow(10, Number(decimals))).toLocaleString("fullwide", {
        useGrouping: false,
    });
    const number = new bn_js_1.default(amountToken).toString();
    return number;
};
const sendTrx = (walletAddress, amountOut, httpProvider, abi, address, symbolCoin) => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(`${httpProvider}`));
    const admin = yield web3.eth.accounts.wallet.add(`${process.env.PRIVATE_KEY}`
    //privateKey wallet
    );
    const Contract = new web3.eth.Contract(abi, address);
    const tx = yield Contract.methods
        .transfer(walletAddress, convertNumber(amountOut, symbolCoin))
        .encodeABI();
    const txdata = {
        from: admin.address,
        to: address,
        data: tx,
        gasLimit: 6721975,
        gas: 2000000,
    };
    yield web3.eth.sendTransaction(txdata).then((dataTrx) => {
        console.log(dataTrx);
    });
});
const reUpStatusFailed = (serial) => __awaiter(void 0, void 0, void 0, function* () {
    yield transactionModel_1.default.updateOne({ serial: serial }, { status: "failed" });
    console.log(`Update status failed for serial ${serial}`);
});
const reUpStatusSuccess = (serial) => __awaiter(void 0, void 0, void 0, function* () {
    yield transactionModel_1.default.updateOne({ serial: serial }, { status: "success" });
    console.log(`Update status success for serial ${serial}`);
});
const checkTxFailed = () => __awaiter(void 0, void 0, void 0, function* () {
    const fetchUsers = yield transactionModel_1.default.find();
    const resultFinal = fetchUsers === null || fetchUsers === void 0 ? void 0 : fetchUsers.filter((res) => {
        if (res.status === "pending") {
            if (res.lastestTime < Math.floor(new Date().getTime() / 1000)) {
                reUpStatusFailed(res.serial);
            }
            else if (res.condition === "Buy") {
                return true;
            }
        }
    });
    return resultFinal;
});
const checkTxValid = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, axios_1.default)({
            method: "get",
            url: `https://api.web2m.com/historyapivcbv3/${process.env.PASSWORK_BANK}/${process.env.ACCOUNT_NUMBER_BANK}/${process.env.SECRET_KEY}`,
        }).then((data) => __awaiter(void 0, void 0, void 0, function* () {
            checkTxFailed().then((res) => {
                console.log("res1: ", res);
                if (res.length === 0)
                    return;
                res === null || res === void 0 ? void 0 : res.map((result) => {
                    const his = data.data.transactions;
                    console.log(his);
                    his === null || his === void 0 ? void 0 : his.forEach((resp) => __awaiter(void 0, void 0, void 0, function* () {
                        if (resp.description.includes(result.serial) &&
                            resp.type === "IN" &&
                            resp.amount == result.amountIn) {
                            yield sendEther(result.network, result.typeCoin, result.walletAddress, result.amountOut);
                            console.log(result);
                            yield reUpStatusSuccess(result.serial);
                        }
                    }));
                });
            });
        }));
    }
    catch (error) {
        (0, axios_1.default)({
            method: "get",
            url: `https://api.web2m.com/historyapivcbv3/${process.env.PASSWORK_BANK}/${process.env.USERNAME_BANK}/${process.env.SECRET_KEY}`,
        }).then((data) => {
            console.log(data);
        });
    }
});
node_schedule_1.default.scheduleJob("*/2 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    checkTxValid();
}));
