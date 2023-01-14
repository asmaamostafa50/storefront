"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../user");
const product_1 = require("../product");
const order_1 = require("../order");
const order_products_1 = require("../order_products");
const userStore = new user_1.UserStore();
const productStore = new product_1.ProductStore();
const orderStore = new order_1.OrderStore();
const orderProductsStore = new order_products_1.OrderProductsStore();
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
const product = {
    name: "product1",
    price: 100
};
let userId;
let productId;
let orderId;
describe('Working Routes Test', () => {
    it('create user', async () => {
        const response = await userStore.create(user2);
        userId = response.id;
        expect(response.user_name).toBe(user2.user_name);
        expect(response.first_name).toBe(user2.first_name);
        expect(response.last_name).toBe(user2.last_name);
    });
    it('get users', async () => {
        const response = await userStore.index();
        expect(response.length).toBeGreaterThanOrEqual(1);
    });
    it('create product', async () => {
        const response = await productStore.create(product.name, product.price);
        productId = response.id;
        expect(response.name).toEqual(product.name);
        expect(response.price).toEqual(product.price);
    });
    const order = {
        user_id: userId,
        completed: false
    };
    it('create order', async () => {
        const response = await orderStore.create(userId);
        orderId = response.id;
        expect(response.user_id).toEqual(userId);
        expect(response.completed).toEqual(order.completed);
    });
    it('get orders', async () => {
        const response = await orderStore.index();
        expect(response.length).toBeGreaterThanOrEqual(1);
    });
    it('get any order', async () => {
        const response = await orderStore.show(orderId);
        expect(response.user_id).toEqual(userId);
        expect(response.completed).toEqual(order.completed);
    });
    it('get order by user id', async () => {
        const response = await orderStore.getUserOrders(userId);
        expect(response.length).toBeGreaterThanOrEqual(1);
    });
    it('create order product', async () => {
        const orderProduct = {
            order_id: orderId,
            product_id: productId,
            quantity: 5
        };
        const response = await orderProductsStore.addProducts(orderProduct);
        expect(response.order_id).toBe(orderProduct.order_id);
        expect(response.product_id).toBe(orderProduct.product_id);
        expect(response.quantity).toBe(orderProduct.quantity);
    });
});
