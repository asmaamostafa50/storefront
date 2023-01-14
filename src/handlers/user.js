"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const dotenv_1 = __importDefault(require("dotenv"));
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const userStore = new user_1.UserStore();
dotenv_1.default.config();
const tokenSecret = process.env.TOKEN_SECRET;
const getUsers = async (req, res) => {
    try {
        let users = await userStore.index();
        res.status(200).json(users);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};
const addUser = async (req, res) => {
    try {
        console.log("here");
        const user = {
            user_name: req.body.user_name,
            password: req.body.password
        };
        const newUser = await userStore.create(user);
        const token = jsonwebtoken_1.default.sign({
            user: {
                user_name: newUser.user_name,
                id: newUser.id
            }
        }, tokenSecret);
        res.status(200).json(token);
    }
    catch (err) {
        console.log("errrrrrrrrrrror: " + err.message);
        res.status(400).json(err.message);
    }
};
const authenticate = async (req, res) => {
    try {
        console.log("here");
        const user = {
            user_name: req.body.user_name,
            password: req.body.password
        };
        const currentUser = await userStore.authenticate(user.user_name, user.password);
        console.log(currentUser);
        if (currentUser) {
            const token = jsonwebtoken_1.default.sign({
                user: {
                    user_name: currentUser.user_name,
                    id: currentUser.id,
                }
            }, tokenSecret);
            res.status(200).json(token);
        }
        else
            res.status(401).json(currentUser);
    }
    catch (err) {
        console.log(err);
        res.status(401).json(err.message);
    }
};
//delete a resouce
const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    if (id) {
        try {
            const deleted = await userStore.delete(id);
            if (deleted) {
                res.sendStatus(200);
            }
            else {
                res.status(404).send('resource not found');
            }
        }
        catch (err) {
            console.log(err);
            res.status(401).send(err);
        }
    }
    else {
        res.sendStatus(404);
    }
};
const userRoutes = (app) => {
    app.post('/users/add', addUser);
    app.post('/users/authenticate', authenticate);
    app.get('/users/list', authentication_1.default, getUsers);
    app.delete('/users/delete/:id', authentication_1.default, deleteUser);
};
exports.default = userRoutes;
