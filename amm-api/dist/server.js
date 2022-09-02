"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const logging_1 = __importDefault(require("./config/logging"));
const config_1 = __importDefault(require("./config/config"));
const mongoose_1 = __importDefault(require("mongoose"));
const transactionRouter_1 = __importDefault(require("./routes/transactionRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const perfectMoneyRouter_1 = __importDefault(require("./routes/perfectMoneyRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
require("./schedule/historybank");
const NAMESPACE = "Server";
const app = (0, express_1.default)();
//testing to push code and deploy server
/** Connect to Mongo */
mongoose_1.default
    .connect(config_1.default.mongo.url, config_1.default.mongo.options)
    .then((result) => {
    logging_1.default.info(NAMESPACE, "Mongo Connected");
})
    .catch((error) => {
    logging_1.default.error(NAMESPACE, error.message, error);
});
/** Limit request API */
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 60,
    handler: (req, res) => {
        return res.status(429).send({
            status: 500,
            message: "Too many requests!",
        });
    },
});
/** Log the request */
app.use((req, res, next) => {
    /** Log the req */
    logging_1.default.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on("finish", () => {
        /** Log the res */
        logging_1.default.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });
    next();
});
/** Parse the body of the request */
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:3000"
}));
app.use((0, cookie_parser_1.default)());
/** Rules of our API */
app.use((req, res, next) => {
    // res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Credentials', "true");
    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});
/** Routes go here */
app.use("/v1/transaction", apiLimiter, transactionRouter_1.default);
app.use("/v1/users", apiLimiter, userRouter_1.default);
app.use("/v1/perfectmoney", apiLimiter, perfectMoneyRouter_1.default);
/** Error handling */
app.use((req, res, next) => {
    const error = new Error("Not found");
    return res.status(404).json({
        message: error.message,
    });
});
const httpServer = http_1.default.createServer(app);
httpServer.listen(config_1.default.server.port, () => logging_1.default.info(NAMESPACE, `Server is running ${config_1.default.server.hostname}:${config_1.default.server.port}`));
