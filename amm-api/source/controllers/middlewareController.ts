import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { NextFunction, Request, Response } from "express";

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const jwtToken: any = req.headers.token;
  if (jwtToken) {
    const accessToken = jwtToken.split(" ")[1];
    jwt.verify(
      accessToken,
      String(process.env.JWT_ACCESS_KEY),
      (err: any, user: any) => {
        if (err) return res.status(403).json("Token is not valid");
        req["user"] = user;
        next();
      }
    );
  } else {
    return res.status(401).json("You are not authenticated");
  }
};
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1, // Limit each IP to 1 create account requests per `window` (here, per hour)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    return res.status(429).send({
      status: 500,
      message:
        "Too many accounts created from this IP, please try again after an hour",
    });
  },
});
const sendMailLimiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 1, // Limit each IP to 1 create account requests per `window` (here, per seconds)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    return res.status(429).send({
      status: "Error",
      message:
        "Too many request send code from this IP, please try again after an 60 seconds",
    });
  },
});

export default {
  verifyAccessToken,
  createAccountLimiter,
  sendMailLimiter,
};
