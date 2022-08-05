import express from "express";
import userController from "../controllers/userController";
import middlewareController from "../controllers/middlewareController";
const routerUsers = express.Router();

routerUsers.get(
  "/getUsers",
  middlewareController.verifyAccessToken,
  userController.GetUsers
);
routerUsers.post("/login", userController.LoginUser);
routerUsers.post(
  "/logout",
  middlewareController.verifyAccessToken,
  userController.LogoutUser
);
routerUsers.post(
  "/register",
  //   middlewareController.createAccountLimiter,
  userController.RegisterUser
);
routerUsers.post("/refreshToken", userController.RefreshToken);
routerUsers.post("/sendMail", middlewareController.sendMailLimiter, userController.sendMailRegister);


export default routerUsers;
