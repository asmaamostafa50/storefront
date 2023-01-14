"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const order_1 = require("../models/order");
const order_products_1 = require("../models/order_products");
const orderProductsStore = new order_products_1.OrderProductsStore();
const orderStore = new order_1.OrderStore();
const getOrders = async (req, res) => {
    try {
        let newOrders = await orderStore.index();
        res.status(200).json(newOrders);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};
//get order by id, we pass variable url by this syntax :varName
const getOrderById = async (req, res) => {
    const id = parseInt(req.params.id);
    if (id) {
        try {
            const order = await orderStore.show(id);
            if (order) {
                res.status(200).json(order);
            }
            else {
                res.status(404).send('resource not found');
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
    else {
        res.sendStatus(404);
    }
};
//post order, adds a new order
const addOrder = async (req, res) => {
    const user_id = req.body.user_id;
    //ensure title validity
    if (user_id && typeof user_id == 'number') {
        const newOrder = await orderStore.create(user_id);
        res.status(200).json(newOrder);
    }
    else {
        res.status(400).send('bad request');
    }
};
//edit a resource
const editOrder = async (req, res) => {
    //ensure order is found
    const id = parseInt(req.params.id);
    if (id) {
        try {
            const title = req.body.title;
            const completed = req.body.completed;
            //no title or completed sent to edit
            if (!('title' in req.body || 'completed' in req.body)) {
                res.status(400).send('missing parameters');
            }
            //title is sent but not as a string
            else if ('title' in req.body && typeof title != 'string') {
                res.status(400).send('title must be a string');
            }
            //completed is sent but not as a boolean
            else if ('completed' in req.body && typeof completed != 'boolean') {
                res.status(400).send('completed must be a boolean');
            }
            else {
                const order = await orderStore.update(id, title, completed);
                res.status(200).json(order);
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
    else {
        res.sendStatus(404);
    }
};
//delete a resouce
const deleteOrder = async (req, res) => {
    const id = parseInt(req.params.id);
    if (id) {
        try {
            const deleted = await orderStore.delete(id);
            if (deleted) {
                res.sendStatus(200);
            }
            else {
                res.status(404).send('resource not found');
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
    else {
        res.sendStatus(404);
    }
};
const getOrderProducts = async (req, res) => {
    const id = parseInt(req.params.id);
    if (id) {
        try {
            const products = await orderProductsStore.showProducts(id);
            if (products) {
                res.status(200).json(products);
            }
            else {
                res.status(404).send('resource not found');
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
    else {
        res.sendStatus(404);
    }
};
const addOrderProducts = async (req, res) => {
    const orderId = parseInt(req.params.id);
    if (orderId) {
        try {
            const orderProduct = {
                order_id: orderId,
                product_id: req.body.product_id,
                quantity: req.body.quantity
            };
            await orderProductsStore.addProducts(orderProduct);
            const products = await orderProductsStore.showProducts(orderId);
            if (products) {
                res.status(200).json(products);
            }
            else {
                res.status(404).send('resource not found');
            }
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
    else {
        res.sendStatus(404);
    }
};
const getUserOrders = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const addedProducts = await orderStore.getUserOrders(userId);
        res.status(200).json(addedProducts);
    }
    catch (error) {
        res.status(400);
        res.json(error.message);
    }
};
const orderRoutes = (app) => {
    app.post('/orders/add', authentication_1.default, addOrder);
    app.get('/orders/list', authentication_1.default, getOrders);
    app.get('/orders/get/:id', authentication_1.default, getOrderById);
    app.patch('/orders/edit/:id', authentication_1.default, editOrder);
    app.delete('/orders/delete/:id', authentication_1.default, deleteOrder);
    app.get('/orders/:id/getProducts', authentication_1.default, getOrderProducts);
    app.post('/orders/:id/addProduct', authentication_1.default, addOrderProducts);
    app.get('/orders/user/:id', authentication_1.default, getUserOrders);
};
exports.default = orderRoutes;
