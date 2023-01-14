import app from '../index';
import supertest from 'supertest';
import jwt_decode from 'jwt-decode';
import { User, UserStore } from '../models/user';
import { Product } from '../models/product';
import { Order } from '../models/order';
import { OrderProduct } from '../models/order_products';

const request = supertest(app);

const userStore = new UserStore();

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

type decodedJwt = {
  user: User
};

const jsonHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

const product: Product = {
  name: "product1",
  price: 100
};

let userId: number;
let productId: number;
let orderId: number;
let token: string;

describe('Test endpoint responses', (): void => {

  it('tests the main endpoint', async (): Promise<void> => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });

  it('authenticate route test', async (): Promise<void> => {
    
    var addedUser = await userStore.create(user);
    console.log("addedUser: " + addedUser);

    const response = await request.post('/users/authenticate').set(jsonHeaders).send({user_name: user.user_name, password : user.password});
    token = 'Bearer ' + response.body;
    console.log('Token: ' + token);
    const decodedUser: User = (jwt_decode(response.body) as decodedJwt).user
    expect(response.status).toBe(200);
    expect(decodedUser.user_name).toBe(user.user_name);
  });

  describe('Access Denied Test', ():void => {
    
    it('401 when get users without token', async (): Promise<void> => {
      const response = await request.get('/users/list');
      expect(response.status).toBe(401);
    });
    it('401 when get orders without token', async (): Promise<void> => {
      const response = await request.get('/orders/list');
      expect(response.status).toBe(401);
    });
    it('401 when create user without token', async (): Promise<void> => {
      const response = await request.post('/users/add').send(user);
      expect(response.status).toBe(401);
    });
    it('401 when create order without token', async (): Promise<void> => {
      const response = await request.post('/orders/add');
      expect(response.status).toBe(401);
    });
    it('401 when create product without token', async (): Promise<void> => {
      const response = await request.post('/products/add').send(product);
      expect(response.status).toBe(401);
    });
    it('401 when get any order without token', async (): Promise<void> => {
      const response = await request.get('/orders/get/1');
      expect(response.status).toBe(401);
    });
    it('401 when get order by user id without token', async (): Promise<void> => {
      const response = await request.get('/orders/user/1');
      expect(response.status).toBe(401);
    });
  });

  describe('Working Routes Test', ():void => {
    
    it('200 when get users with token', async (): Promise<void> => {
      const response = await request.get('/users/list')
      .set({ ...jsonHeaders, Authorization: token});
      expect(response.status).toBe(200);
    });
    it('200 when create user with token', async (): Promise<void> => {
      const response = await request.post('/users/add').send(user2)
      .set({ ...jsonHeaders, Authorization: token});

      const decodedUser: User = (jwt_decode(response.body) as decodedJwt).user
      userId = decodedUser.id as number;

      expect(response.status).toBe(200);
      expect(decodedUser.user_name).toEqual(user2.user_name);
    });
    it('200 when create product with token', async (): Promise<void> => {
      const response = await request.post('/products/add').send(product)
      .set({ ...jsonHeaders, Authorization: token});

      productId = response.body.id;

      expect(response.status).toBe(200);
      expect(response.body.name).toEqual(product.name);
      expect(response.body.price).toEqual(product.price);
    });

    const order: Order = {
      user_id: userId,
      completed: false
    }

    it('200 when create order with token', async (): Promise<void> => {
      const response = await request.post('/orders/add').send({user_id: userId})
      .set({ ...jsonHeaders, Authorization: token});

      orderId = response.body.id;

      expect(response.status).toBe(200);
      expect(response.body.user_id).toEqual(userId);
      expect(response.body.completed).toEqual(order.completed);
    });
    it('200 when get orders with token', async (): Promise<void> => {
      const response = await request.get('/orders/list')
      .set({ ...jsonHeaders, Authorization: token});
      expect(response.status).toBe(200);
    });
    it('200 when get any order with token', async (): Promise<void> => {
      const response = await request.get(`/orders/get/${orderId}`)
      .set({ ...jsonHeaders, Authorization: token});
      expect(response.status).toBe(200);
      expect(response.body.user_id).toEqual(userId);
      expect(response.body.completed).toEqual(order.completed);
    });
    it('200 when get order by user id with token', async (): Promise<void> => {
      const response = await request.get(`/orders/user/${userId}`)
      .set({ ...jsonHeaders, Authorization: token});
      expect(response.status).toBe(200);
      expect(response.body.user_id).toEqual(order.user_id);
      expect(response.body.order_id).toEqual(order.id);
    });
    it('200 when create order product with token', async (): Promise<void> => {
      const orderProduct : OrderProduct = {
        order_id: orderId,
        product_id: productId,
        quantity: 5
      }
      const response = await request.post(`/orders/${orderId}/addProduct`).send(orderProduct)
      .set({ ...jsonHeaders, Authorization: token});
      expect(response.status).toBe(200);
    });
  });
  
});
