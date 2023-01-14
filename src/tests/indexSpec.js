"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const supertest_1 = __importDefault(require("supertest"));
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const user_1 = require("../models/user");
const request = (0, supertest_1.default)(index_1.default);
const userStore = new user_1.UserStore();
const user = {
    user_name: "user1",
    password: "password",
    first_name: "asmaa1",
    last_name: "mostafa1"
};
const user2 = {
    user_name: "user2",
    password: "password",
    first_name: "asmaa2",
    last_name: "mostafa2"
};
const jsonHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};
const product = {
    name: "product1",
    price: 100
};
let userId;
let productId;
let orderId;
let token;
describe('Test endpoint responses', () => {
    it('tests the main endpoint', async () => {
        const response = await request.get('/');
        expect(response.status).toBe(200);
    });
    it('authenticate route test', async () => {
        var addedUser = await userStore.create(user);
        console.log("addedUser: " + addedUser);
        const response = await request.post('/users/authenticate').set(jsonHeaders).send({ user_name: user.user_name, password: user.password });
        token = 'Bearer ' + response.body;
        console.log('Token: ' + token);
        const decodedUser = (0, jwt_decode_1.default)(response.body).user;
        expect(response.status).toBe(200);
        expect(decodedUser.user_name).toBe(user.user_name);
    });
    describe('Access Denied Test', () => {
        it('401 when get users without token', async () => {
            const response = await request.get('/users/list');
            expect(response.status).toBe(401);
        });
        it('401 when get orders without token', async () => {
            const response = await request.get('/orders/list');
            expect(response.status).toBe(401);
        });
        it('401 when create order without token', async () => {
            const response = await request.post('/orders/add');
            expect(response.status).toBe(401);
        });
        it('401 when create product without token', async () => {
            const response = await request.post('/products/add').send(product);
            expect(response.status).toBe(401);
        });
        it('401 when get any order without token', async () => {
            const response = await request.get('/orders/get/1');
            expect(response.status).toBe(401);
        });
        it('401 when get order by user id without token', async () => {
            const response = await request.get('/orders/user/1');
            expect(response.status).toBe(401);
        });
    });
    describe('Working Routes Test', () => {
        it('200 when get users with token', async () => {
            const response = await request.get('/users/list')
                .set({ ...jsonHeaders, Authorization: token });
            expect(response.status).toBe(200);
        });
        it('200 when create user with token', async () => {
            const response = await request.post('/users/add').send(user2);
            const decodedUser = (0, jwt_decode_1.default)(response.body).user;
            userId = decodedUser.id;
            expect(response.status).toBe(200);
            expect(decodedUser.user_name).toEqual(user2.user_name);
        });
        it('200 when create product with token', async () => {
            const response = await request.post('/products/add').send(product)
                .set({ ...jsonHeaders, Authorization: token });
            productId = response.body.id;
            expect(response.status).toBe(200);
            expect(response.body.name).toEqual(product.name);
            expect(response.body.price).toEqual(product.price);
        });
        const order = {
            user_id: userId,
            completed: false
        };
        it('200 when create order with token', async () => {
            const response = await request.post('/orders/add').send({ user_id: userId })
                .set({ ...jsonHeaders, Authorization: token });
            orderId = response.body.id;
            expect(response.status).toBe(200);
            expect(response.body.user_id).toEqual(userId);
            expect(response.body.completed).toEqual(order.completed);
        });
        it('200 when get orders with token', async () => {
            const response = await request.get('/orders/list')
                .set({ ...jsonHeaders, Authorization: token });
            expect(response.status).toBe(200);
        });
        it('200 when get any order with token', async () => {
            const response = await request.get(`/orders/get/${orderId}`)
                .set({ ...jsonHeaders, Authorization: token });
            expect(response.status).toBe(200);
            expect(response.body.user_id).toEqual(userId);
            expect(response.body.completed).toEqual(order.completed);
        });
        it('200 when get order by user id with token', async () => {
            const response = await request.get(`/orders/user/${userId}`)
                .set({ ...jsonHeaders, Authorization: token });
            expect(response.status).toBe(200);
            expect(response.body.user_id).toEqual(order.user_id);
            expect(response.body.order_id).toEqual(order.id);
        });
        it('200 when create order product with token', async () => {
            const orderProduct = {
                order_id: orderId,
                product_id: productId,
                quantity: 5
            };
            const response = await request.post(`/orders/${orderId}/addProduct`).send(orderProduct)
                .set({ ...jsonHeaders, Authorization: token });
            expect(response.status).toBe(200);
        });
    });
});
