"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendMailController_1 = __importDefault(require("./sendMailController"));
dotenv_1.default.config();
let RefreshTokenArr = [];
const generateRandomNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
};
const RegisterUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formData = req.body;
        console.log(formData);
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashed = yield bcryptjs_1.default.hash(formData.password, salt);
        const dto = new userModel_1.default(Object.assign(Object.assign({}, formData), { password: hashed }));
        yield dto
            .save()
            .then((data) => res.status(200).json({ status: "Success" }))
            .catch((error) => res.status(404).json({ status: "Register failed", error }));
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
const sendMailRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formData = req.body;
        const codeMail = generateRandomNumber();
        yield sendMailController_1.default.sendMail(formData.email, codeMail);
        return res
            .status(200)
            .json({ status: "Success", code: codeMail, email: formData.email });
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
const LoginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formData = req.body;
        console.log(formData);
        const userData = yield userModel_1.default.findOne({
            username: formData.username,
        });
        if (!userData)
            return res.status(404).json({ status: "Wrong Username" });
        const result = yield bcryptjs_1.default.compare(formData.password, userData === null || userData === void 0 ? void 0 : userData.password);
        if (!result)
            return res.status(404).json({ status: "Wrong Password" });
        if (userData && result) {
            const accessToken = generateJWTToken(userData);
            const refreshToken = generateRefreshJWTToken(userData);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            RefreshTokenArr.push(refreshToken);
            const _a = userData._doc, { password } = _a, otherPassword = __rest(_a, ["password"]);
            return res.status(200).json(Object.assign(Object.assign({}, otherPassword), { accessToken }));
        }
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
const GetUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.find();
    return res.status(200).json({ user });
});
const RefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let refreshToken = req.cookies["refreshToken"];
    if (!refreshToken)
        return res.status(401).json("You are not authenticated");
    if (!(RefreshTokenArr === null || RefreshTokenArr === void 0 ? void 0 : RefreshTokenArr.includes(refreshToken)))
        return res.status(401).json("Refresh token is not valid");
    jsonwebtoken_1.default.verify(refreshToken, String(process.env.JWT_REFRESH_KEY), (err, user) => {
        if (err)
            console.log(err);
        refreshToken = RefreshTokenArr.filter((token) => token !== refreshToken);
        const newAccessToken = generateJWTToken(user);
        const newRefreshToken = generateRefreshJWTToken(user);
        RefreshTokenArr.push(newRefreshToken);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
        });
        console.log("Has been refresh token");
        return res.status(200).json(newAccessToken);
    });
});
const LogoutUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("refreshToken");
    RefreshTokenArr = RefreshTokenArr.filter((token) => token !== res.cookie["refreshToken"]);
    return res.status(200).json("Logged out!");
});
const generateJWTToken = (userData) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: userData.id, admin: userData.admin }, String(process.env.JWT_ACCESS_KEY), {
        expiresIn: "6h",
    });
    return accessToken;
};
const generateRefreshJWTToken = (userData) => {
    const refreshToken = jsonwebtoken_1.default.sign({ id: userData.id, admin: userData.admin }, String(process.env.JWT_REFRESH_KEY), {
        expiresIn: "365d",
    });
    return refreshToken;
};
exports.default = {
    RegisterUser,
    LoginUser,
    GetUsers,
    RefreshToken,
    LogoutUser,
    sendMailRegister,
};
