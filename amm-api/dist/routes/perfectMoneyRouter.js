"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const perfectMoneyController_1 = __importDefault(require("../controllers/perfectMoneyController"));
const routerPFM = express_1.default.Router();
routerPFM.get("/", perfectMoneyController_1.default.handlePerfectMoney);
exports.default = routerPFM;
