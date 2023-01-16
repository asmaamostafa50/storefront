import { User, UserStore } from '../user';
import { Product, ProductStore } from '../product';
import { Order, OrderStore } from '../order';
import { OrderProduct, OrderProductsStore } from '../order_products';

const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();
const orderProductsStore = new OrderProductsStore();

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


const product: Product = {
  name: "product1",
  price: 100
};

let userId: number;
let productId: number;
let orderId: number;

describe('Working Routes Test', ():void => {
    it('create user', async (): Promise<void> => {
      const response = await userStore.create(user2);
      userId = response.id as number;
      expect(response.user_name).toBe(user2.user_name);
      expect(response.first_name).toBe(user2.first_name);
      expect(response.last_name).toBe(user2.last_name);
    });
    it('get user by id', async (): Promise<void> => {
      const response = await userStore.show(userId);
      expect(response.user_name).toBe(user2.user_name);
    });
    it('get users', async (): Promise<void> => {
        const response = await userStore.index();
        expect(response.length).toBeGreaterThanOrEqual(1);
      });
    it('create product', async (): Promise<void> => {
      const response = await productStore.create(product.name, product.price);
      productId = response.id as number;
      expect(response.name).toEqual(product.name);
      expect(response.price).toEqual(product.price);
    });
    it('get product by id', async (): Promise<void> => {
      const response = await productStore.show(productId);
      expect(response.name).toBe(product.name);
      expect(response.price).toEqual(product.price);
    });
    it('get products', async (): Promise<void> => {
      const response = await productStore.index();
      expect(response.length).toBeGreaterThanOrEqual(1);
    });
    const order: Order = {
      user_id: userId,
      completed: false
    }
    it('create order', async (): Promise<void> => {
      const response = await orderStore.create(userId);
      orderId = response.id as number;
      expect(response.user_id).toEqual(userId);
      expect(response.completed).toEqual(order.completed);
    });
    it('get orders', async (): Promise<void> => {
      const response = await orderStore.index();
      expect(response.length).toBeGreaterThanOrEqual(1);
    });
    it('get any order', async (): Promise<void> => {
      const response = await orderStore.show(orderId);
      expect(response.user_id).toEqual(userId);
      expect(response.completed).toEqual(order.completed);
    });
    it('get order by user id', async (): Promise<void> => {
      const response = await orderStore.getUserOrders(userId);
      expect(response.length).toBeGreaterThanOrEqual(1);
    });
    it('create order product', async (): Promise<void> => {
      const orderProduct : OrderProduct = {
        order_id: orderId,
        product_id: productId,
        quantity: 5
      }
      const response = await orderProductsStore.addProducts(orderProduct)
      expect(response.order_id).toBe(orderProduct.order_id);
      expect(response.product_id).toBe(orderProduct.product_id);
      expect(response.quantity).toBe(orderProduct.quantity);
    });
  });
  