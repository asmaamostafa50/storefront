import express, { Request, Response } from 'express';
import authentication from '../middlewares/authentication';
import { Product, ProductStore } from '../models/product';


const productStore = new ProductStore();


const getProducts =  async (req: Request, res: Response): Promise<void> => {
  try {
    let newProducts: Product[] = await productStore.index();
    const limit: number = parseInt(req.query.limit as string);
    const sortQuery: string = req.query.sort as string;

    if (limit) {
      if (limit < newProducts.length) {
        newProducts = newProducts.slice(0, limit);
      }
    }

    if (typeof sortQuery !== 'undefined') {
      const sortedLower = sortQuery.toLowerCase();
      if (sortedLower === 'asc' || sortedLower === 'dec') {
        newProducts = newProducts.sort((first, second) => {
          const a: Product = sortedLower === 'asc' ? first : second;
          const b: Product = sortedLower === 'asc' ? second : first;

          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
      } else {
        res.status(400).send('sort must be asc or dec case insensitive');
      }
    }
    res.status(200).json(newProducts);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

//get product by id, we pass variable url by this syntax :varName
const getProductById = async (req: Request, res: Response): Promise<void> => {
  const id: number = parseInt(req.params.id as string);
  if (id) {
    try {
      const product: Product | undefined = await productStore.show(id);

      if (product) {
        res.status(200).json(product);
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

//post product, adds a new product
const addProduct = async (req: Request, res: Response): Promise<void> => {
  const name: string = req.body.name;
  const price: number = req.body.price;

  //ensure name validity
  if (name && typeof name == 'string') {
    const newProduct = await productStore.create(name, price);
    res.status(200).json(newProduct);
  } else {
    res.status(400).send('bad request');
  }
};

const productRoutes = (app: express.Application):void =>{
  app.post('/products/add', authentication, addProduct);
  app.get('/products/list', getProducts);
  app.get('/products/:id', getProductById);
};  
export default productRoutes;
