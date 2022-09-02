"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const middlewareController_1 = __importDefault(require("../controllers/middlewareController"));
const routerUsers = express_1.default.Router();
routerUsers.get("/getUsers", middlewareController_1.default.verifyAccessToken, userController_1.default.GetUsers);
routerUsers.post("/login", userController_1.default.LoginUser);
routerUsers.post("/logout", middlewareController_1.default.verifyAccessToken, userController_1.default.LogoutUser);
routerUsers.post("/register", 
//   middlewareController.createAccountLimiter,
userController_1.default.RegisterUser);
routerUsers.post("/refreshToken", userController_1.default.RefreshToken);
routerUsers.post("/sendMail", middlewareController_1.default.sendMailLimiter, userController_1.default.sendMailRegister);
exports.default = routerUsers;
