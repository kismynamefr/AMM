import http from "http";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import logging from "./config/logging";
import config from "./config/config";
import mongoose from "mongoose";
import routerTrx from "./routes/transactionRouter";
import routerUsers from "./routes/userRouter";
import routerPFM from "./routes/perfectMoneyRouter";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import "./schedule/historybank";
import { NextFunction, Request, Response } from "express";

const NAMESPACE = "Server";
const app = express();
//testing to push code and deploy server

/** Connect to Mongo */
mongoose
  .connect(config.mongo.url, config.mongo.options)
  .then((result) => {
    logging.info(NAMESPACE, "Mongo Connected");
  })
  .catch((error) => {
    logging.error(NAMESPACE, error.message, error);
  });

/** Limit request API */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 60,
  handler: (req: Request, res: Response) => {
    return res.status(429).send({
      status: 500,
      message: "Too many requests!",
    });
  },
});

/** Log the request */
app.use((req: Request, res: Response, next: NextFunction) => {
  /** Log the req */
  logging.info(
    NAMESPACE,
    `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    /** Log the res */
    logging.info(
      NAMESPACE,
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
    );
  });

  next();
});

/** Parse the body of the request */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000"
}));
app.use(cookieParser());

/** Rules of our API */
app.use((req: Request, res: Response, next: NextFunction) => {
  // res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header('Access-Control-Allow-Credentials', "true");
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

/** Routes go here */
app.use("/v1/transaction", apiLimiter, routerTrx);
app.use("/v1/users", apiLimiter, routerUsers);
app.use("/v1/perfectmoney", apiLimiter, routerPFM);

/** Error handling */
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found");
  return res.status(404).json({
    message: error.message,
  });
});

const httpServer = http.createServer(app);

httpServer.listen(config.server.port, () =>
  logging.info(
    NAMESPACE,
    `Server is running ${config.server.hostname}:${config.server.port}`
  )
);
