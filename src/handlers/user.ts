import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserStore } from '../models/user';
import dotenv from 'dotenv';
import authentication from '../middlewares/authentication';
const userStore = new UserStore();
dotenv.config();
const tokenSecret = process.env.TOKEN_SECRET;

const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      let users: User[] = await userStore.index();
      res.status(200).json(users);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
};

const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("here");
    const user: User = {
      user_name: req.body.user_name,
      password: req.body.password
    };

    const newUser = await userStore.create(user);
    const token = jwt.sign(
      {
        user: {
          user_name: newUser.user_name,
          id: newUser.id
        }
      },
      tokenSecret as string
    );
    res.status(200).json(token);
  } catch (err) {
    console.log("errrrrrrrrrrror: " + (err as Error).message);
    res.status(400).json((err as Error).message);
  }
};

const authenticate = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("here");
    const user = {
      user_name: req.body.user_name,
      password: req.body.password
    };

    const currentUser = await userStore.authenticate(user.user_name, user.password) as User;
    console.log(currentUser);

    if(currentUser){
      const token = jwt.sign(
        {
          user: {
            user_name: currentUser.user_name,
            id: currentUser.id,
          }
        },
        tokenSecret as string
      );
      res.status(200).json(token);
    }
    else
      res.status(401).json(currentUser);
  } catch (err) {
    console.log(err);
    res.status(401).json((err as Error).message);
  }
};

//delete a resouce
const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string);
    if (id) {
      try {
        const deleted: number | undefined = await userStore.delete(id);
        if (deleted) {
          res.sendStatus(200);
        } else {
          res.status(404).send('resource not found');
        }
      } catch (err) {
        console.log(err);
        res.status(401).send(err);
      }
    } else {
      res.sendStatus(404);
    }
};

const userRoutes = (app: express.Application):void =>{
  app.post('/users/add', authentication, addUser);
  app.post('/users/authenticate', authenticate);
  app.get('/users/list', authentication, getUsers);
  app.delete('/users/delete/:id', authentication, deleteUser);
};  
export default userRoutes;