import express from "express";
import trxController from "../controllers/transactionController";

const routerTrx = express.Router();

routerTrx.post("/", trxController.SaveTransaction);
routerTrx.get("/transaction/:serial", trxController.GetTransaction);
routerTrx.get("/transactionHash/:serial", trxController.GetTransactionHash);
routerTrx.post("/transactionHash/sendTrx", trxController.HandleTransactionHash);
routerTrx.get("/transactionStatus/:status", trxController.getTransactionSuccess);

export default routerTrx;
