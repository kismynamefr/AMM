import express from "express";
import trxController from "../controllers/transactionController";
import middlewareController from "../controllers/middlewareController";

const routerTrx = express.Router();

routerTrx.post("/", middlewareController.verifyAccessToken, trxController.SaveTransaction);
routerTrx.get("/getTransaction/:serial", middlewareController.verifyAccessToken, trxController.GetTransaction);
routerTrx.get("/getTransactionHash/:serial", middlewareController.verifyAccessToken, trxController.GetTransactionHash);
routerTrx.post("/sendTransactionHash/sendTrx", middlewareController.verifyAccessToken, trxController.HandleTransactionHash);
routerTrx.get("/getTransactionSuccess/:status", trxController.getTransactionSuccess);

export default routerTrx;
