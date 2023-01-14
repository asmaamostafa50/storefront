"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const product_1 = require("../models/product");
const productStore = new product_1.ProductStore();
const getProducts = async (req, res) => {
    try {
        let newProducts = await productStore.index();
        const limit = parseInt(req.query.limit);
        const sortQuery = req.query.sort;
        if (limit) {
            if (limit < newProducts.length) {
                newProducts = newProducts.slice(0, limit);
            }
        }
        if (typeof sortQuery !== 'undefined') {
            const sortedLower = sortQuery.toLowerCase();
            if (sortedLower === 'asc' || sortedLower === 'dec') {
                newProducts = newProducts.sort((first, second) => {
                    const a = sortedLower === 'asc' ? first : second;
                    const b = sortedLower === 'asc' ? second : first;
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                });
            }
            else {
                res.status(400).send('sort must be asc or dec case insensitive');
            }
        }
        res.status(200).json(newProducts);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};
//get product by id, we pass variable url by this syntax :varName
const getProductById = async (req, res) => {
    const id = parseInt(req.params.id);
    if (id) {
        try {
            const product = await productStore.show(id);
            if (product) {
                res.status(200).json(product);
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
//post product, adds a new product
const addProduct = async (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    //ensure name validity
    if (name && typeof name == 'string') {
        const newProduct = await productStore.create(name, price);
        res.status(200).json(newProduct);
    }
    else {
        res.status(400).send('bad request');
    }
};
//edit a resource
const editProduct = async (req, res) => {
    //ensure product is found
    const id = parseInt(req.params.id);
    if (id) {
        try {
            const name = req.body.name;
            const price = req.body.price;
            //no name or completed sent to edit
            if (!('name' in req.body)) {
                res.status(400).send('missing parameters');
            }
            //name is sent but not as a string
            else if ('name' in req.body && typeof name != 'string') {
                res.status(400).send('name must be a string');
            }
            if (!('price' in req.body)) {
                res.status(400).send('missing parameters');
            }
            //name is sent but not as a string
            else if ('price' in req.body && typeof price != 'number') {
                res.status(400).send('price must be a number');
            }
            //completed is sent but not as a boolean
            else {
                const product = await productStore.update(id, name, price);
                res.status(200).json(product);
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
const deleteProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    if (id) {
        try {
            const deleted = await productStore.delete(id);
            if (deleted) {
                res.status(200).send('deleted successfuly');
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
const productRoutes = (app) => {
    app.post('/products/add', authentication_1.default, addProduct);
    app.post('/products/list', getProducts);
    app.get('/products/:id', getProductById);
    app.patch('/products/edit/:id', authentication_1.default, editProduct);
    app.delete('/products/delete/:id', authentication_1.default, deleteProduct);
};
exports.default = productRoutes;
