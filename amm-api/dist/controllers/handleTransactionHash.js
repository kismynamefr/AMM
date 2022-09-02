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
exports.checkNetwork = void 0;
const axios_1 = __importDefault(require("axios"));
const bn_js_1 = __importDefault(require("bn.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const Tether_1 = require("../abi/Tether");
dotenv_1.default.config();
const checkNetwork = (network, txHash, typeCoin, beginTime, amountIn) => __awaiter(void 0, void 0, void 0, function* () {
    let resultBSCAPI, resultEtherAPI;
    switch (network) {
        case "Ethereum":
            console.log("Ethereum");
            resultEtherAPI = yield getTransactionHashByEtherAPI(typeCoin);
            const txHashEtherAPI = resultEtherAPI === null || resultEtherAPI === void 0 ? void 0 : resultEtherAPI.filter((rols) => (rols === null || rols === void 0 ? void 0 : rols.tokenSymbol) === typeCoin &&
                (rols === null || rols === void 0 ? void 0 : rols.value) === convertNumber(amountIn, Number(rols === null || rols === void 0 ? void 0 : rols.tokenDecimal)) &&
                (rols === null || rols === void 0 ? void 0 : rols.timeStamp) > beginTime);
            return txHashEtherAPI;
        case "Binance":
            console.log("Binance");
            resultBSCAPI = yield getTransactionHashByBSCAPI(typeCoin);
            const txHashBSCAPI = resultBSCAPI === null || resultBSCAPI === void 0 ? void 0 : resultBSCAPI.filter((rols) => (rols === null || rols === void 0 ? void 0 : rols.hash) === txHash &&
                (rols === null || rols === void 0 ? void 0 : rols.tokenSymbol) === typeCoin &&
                (rols === null || rols === void 0 ? void 0 : rols.value) === convertNumber(amountIn, Number(rols === null || rols === void 0 ? void 0 : rols.tokenDecimal)) &&
                (rols === null || rols === void 0 ? void 0 : rols.timeStamp) > beginTime);
            return txHashBSCAPI;
        default:
            break;
    }
});
exports.checkNetwork = checkNetwork;
const getTransactionHashByBSCAPI = (typeCoin) => {
    switch (typeCoin) {
        case "USDT":
            return handleAddressContractToken(Tether_1.USDT_BSC_ADDRESS);
        case "BUSD":
            return handleAddressContractToken(Tether_1.BUSD_BSC_TESTNET_ADDRESS);
        case "DAI":
            return handleAddressContractToken(Tether_1.DAI_BSC_ADDRESS);
        default:
            break;
    }
};
const getTransactionHashByEtherAPI = (typeCoin) => {
    switch (typeCoin) {
        case "USDT":
            return handleAddressContractTokenETher(Tether_1.USDT_ETH_ADDRESS);
        default:
            break;
    }
};
const handleAddressContractToken = (contractAddressToken) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield (0, axios_1.default)({
        method: "get",
        url: `https://api-testnet.bscscan.com/api?module=account&action=tokentx&contractaddress=${contractAddressToken}&address=${process.env.DEFAULT_ADDRESS}&page=1&offset=10&sort=asc&apikey=${process.env.BSC_TESTNET_API_KEY}`,
    });
    return data === null || data === void 0 ? void 0 : data.data.result;
});
const handleAddressContractTokenETher = (contractAddressToken) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield (0, axios_1.default)({
        method: "get",
        url: `https://api-ropsten.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddressToken}&address=${process.env.DEFAULT_ADDRESS}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${process.env.ETHER_TESTNET_API_KEY}`,
    });
    return data === null || data === void 0 ? void 0 : data.data.result;
});
const convertNumber = (amount, decimals) => {
    const amountToken = (Number(amount) * Math.pow(10, Number(decimals))).toLocaleString("fullwide", {
        useGrouping: false,
    });
    const number = new bn_js_1.default(amountToken).toString();
    return number;
};
