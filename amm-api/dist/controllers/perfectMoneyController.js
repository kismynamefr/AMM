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
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const handlePerfectMoney = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let data1;
    var child = (0, child_process_1.spawn)('python3', [
        './source/controllers/perfectMoneyPython/perfectMoney.py',
        // "req.query.firstname",
        // "req.query.lastname"
    ], { shell: true });
    child.stdout.on('data', function (err, data) {
        if (err)
            res.send(err);
        const data1 = data === null || data === void 0 ? void 0 : data.toString();
    });
    child.stderr.on('data', (data) => {
        console.error('stderr: ', data.toString('utf8'));
    });
    child.on('close', (code) => {
        res.send(data1);
    });
});
exports.default = {
    handlePerfectMoney
};
