"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transactionController_1 = __importDefault(require("../controllers/transactionController"));
const middlewareController_1 = __importDefault(require("../controllers/middlewareController"));
const routerTrx = express_1.default.Router();
routerTrx.post("/", middlewareController_1.default.verifyAccessToken, transactionController_1.default.SaveTransaction);
routerTrx.get("/getTransaction/:serial", middlewareController_1.default.verifyAccessToken, transactionController_1.default.GetTransaction);
routerTrx.get("/getTransactionHash/:serial", middlewareController_1.default.verifyAccessToken, transactionController_1.default.GetTransactionHash);
routerTrx.post("/sendTransactionHash", middlewareController_1.default.verifyAccessToken, transactionController_1.default.HandleTransactionHash);
routerTrx.get("/getTransactionSuccess/:status", transactionController_1.default.getTransactionSuccess);
exports.default = routerTrx;
