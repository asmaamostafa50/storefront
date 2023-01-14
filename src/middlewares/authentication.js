"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authentication = (req, res, next) => {
    try {
        const tokenSecret = process.env.TOKEN_SECRET;
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, tokenSecret);
        return next();
    }
    catch (err) {
        res.status(401);
        res.json('Access denied, invalid token');
    }
};
exports.default = authentication;
