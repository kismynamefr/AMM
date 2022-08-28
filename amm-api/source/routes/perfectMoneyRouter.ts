import express from "express";
import middlewareController from "../controllers/middlewareController";
import perfectMoneyController from "../controllers/perfectMoneyController";

const routerPFM = express.Router();

routerPFM.get("/", perfectMoneyController.handlePerfectMoney);

export default routerPFM;
