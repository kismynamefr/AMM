import { spawn } from 'child_process';
import { NextFunction, Request, Response } from "express";


const handlePerfectMoney = async (req: Request, res: Response, next: NextFunction) => {
    let data1: any;
    var child = spawn('python3', [
        './source/controllers/perfectMoneyPython/perfectMoney.py',
        // "req.query.firstname",
        // "req.query.lastname"
    ], { shell: true });
    child.stdout.on('data', function (err: any, data: any) {
        if (err) res.send(err);
        const data1 = data?.toString();
    })
    child.stderr.on('data', (data) => {
        console.error('stderr: ', data.toString('utf8'));
    })
    child.on('close', (code) => {
        res.send(data1);
    })
};

export default {
    handlePerfectMoney
}