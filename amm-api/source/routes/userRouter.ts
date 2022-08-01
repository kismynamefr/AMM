import express from "express";
import userController from "../controllers/userController";

const routerUsers = express.Router();

routerUsers.post("/register", userController.RegisterTransaction);

export default routerUsers;
