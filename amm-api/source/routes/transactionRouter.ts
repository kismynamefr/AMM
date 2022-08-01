import express from "express";
import controller from "../controllers/transactionController";

const routerTrx = express.Router();

routerTrx.post("/", controller.SaveTransaction);
routerTrx.get("/transaction/:serial", controller.GetTransaction);
routerTrx.get("/transactionHash/:serial", controller.GetTransactionHash);
routerTrx.post("/transactionHash/sendTrx", controller.HandleTransactionHash);
routerTrx.get("/transactionStatus/:status", controller.getTransactionSuccess);

export default routerTrx;
