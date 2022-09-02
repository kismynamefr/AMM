"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const verifyAccessToken = (req, res, next) => {
    const jwtToken = req.headers.token;
    if (jwtToken) {
        const accessToken = jwtToken.split(" ")[1];
        jsonwebtoken_1.default.verify(accessToken, String(process.env.JWT_ACCESS_KEY), (err, user) => {
            if (err)
                return res.status(403).json("Token is not valid");
            else {
                req["user"] = user;
                next();
            }
        });
    }
    else {
        return res.status(401).json("You are not authenticated");
    }
};
const createAccountLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 1,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return res.status(429).send({
            status: 500,
            message: "Too many accounts created from this IP, please try again after an hour",
        });
    },
});
const sendMailLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 1,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return res.status(429).send({
            status: "Error",
            message: "Too many request send code from this IP, please try again after an 60 seconds",
        });
    },
});
exports.default = {
    verifyAccessToken,
    createAccountLimiter,
    sendMailLimiter,
};
