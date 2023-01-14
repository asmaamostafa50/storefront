import express, { Request, Response } from 'express';
import authentication from '../middlewares/authentication';
import { Order, OrderStore } from '../models/order';
import { OrderProduct, OrderProductsStore } from '../models/order_products';
import { Product } from '../models/product';

const orderProductsStore = new OrderProductsStore();
const orderStore = new OrderStore();

const getOrders =  async (req: Request, res: Response): Promise<void> => {
  try {
    let newOrders: Order[] = await orderStore.index();    
    res.status(200).json(newOrders);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

//get order by id, we pass variable url by this syntax :varName
const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const order: Order | undefined = await orderStore.show(id);

      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).send('resource not found');
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
};

//post order, adds a new order
const addOrder = async (req: Request, res: Response): Promise<void> => {
  const user_id: null | undefined = req.body.user_id;

  //ensure title validity
  if (user_id && typeof user_id == 'number') {
    const newOrder = await orderStore.create(user_id);
    res.status(200).json(newOrder);
  } else {
    res.status(400).send('bad request');
  }
};

//edit a resource
const editOrder = async (req: Request, res: Response): Promise<void> => {
  //ensure order is found
  const id: number = parseInt(req.params.id as string);

  if (id) {
    try {
      const title: string | undefined = req.body.title;
      const completed: boolean | undefined = req.body.completed;
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
      } else {
        const order = await orderStore.update(id, title, completed);
        res.status(200).json(order);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  } else {
    res.sendStatus(404);
  }
};

//delete a resouce
const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string);
    if (id) {
      try {
        const deleted: number | undefined = await orderStore.delete(id);
        if (deleted) {
          res.sendStatus(200);
        } else {
          res.status(404).send('resource not found');
        }
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
      }
    } else {
      res.sendStatus(404);
    }
};

const getOrderProducts = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
      try {
      const products: Product[] | undefined = await orderProductsStore.showProducts(id);

      if (products) {
          res.status(200).json(products);
      } else {
          res.status(404).send('resource not found');
      }
      } catch (err) {
      console.log(err);
      res.status(500).send(err);
      }
  } else {
      res.sendStatus(404);
  }
};

const addOrderProducts = async (req: Request, res: Response): Promise<void> => {
  const orderId: number = parseInt(req.params.id as string);
  if (orderId) {
      try {
      const orderProduct : OrderProduct = {
          order_id: orderId,
          product_id: req.body.product_id,
          quantity: req.body.quantity
      }  
      await orderProductsStore.addProducts(orderProduct);
      const products: Product[] | undefined = await orderProductsStore.showProducts(orderId);

      if (products) {
          res.status(200).json(products);
      } else {
          res.status(404).send('resource not found');
      }
      } catch (err) {
      console.log(err);
      res.status(500).send(err);
      }
  } else {
      res.sendStatus(404);
  }
};

const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId: number = parseInt(req.params.id);
    const addedProducts = await orderStore.getUserOrders(userId);
    res.status(200).json(addedProducts);
  } catch (error) {
    res.status(400);
    res.json((error as Error).message);
  }
} 

const orderRoutes = (app: express.Application):void =>{
  app.post('/orders/add', authentication, addOrder);
  app.get('/orders/list', authentication, getOrders);
  app.get('/orders/get/:id', authentication, getOrderById);
  app.patch('/orders/edit/:id', authentication, editOrder);
  app.delete('/orders/delete/:id', authentication, deleteOrder);
  app.get('/orders/:id/getProducts', authentication, getOrderProducts);
  app.post('/orders/:id/addProduct', authentication, addOrderProducts);
  app.get('/orders/user/:id', authentication, getUserOrders);
};  
export default orderRoutes;
