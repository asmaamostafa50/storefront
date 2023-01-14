import express, { Request, Response, Application } from 'express';
import logger from './middlewares/logger';
import orderRoutes from './handlers/order';
import userRoutes from './handlers/user';
import productRoutes from './handlers/product';
import bodyParser from 'body-parser';

const app: Application = express();
const port: number = 3000;

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
  },
  apis: ['./routes/routes.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

app.use(
  '/api-docs',
  swaggerUI.serve, 
  swaggerUI.setup(openapiSpecification)
);

/*
const outputFile = '../swagger_output.json'
const endpointsFiles = [userRoutes, orderRoutes, productRoutes];

const swaggerAutogen = require('swagger-autogen')()
swaggerAutogen(outputFile, endpointsFiles)

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('swagger_output.json');
*/


app.use(bodyParser.json());

//app.use a list of your custom middlewares
app.use([logger]);

//app.Method takes two parameters, URI and callback function
//callback function takes request and response objects as parameters
app.get('/', async (req: Request, res: Response): Promise<void> => {
  res.sendFile(__dirname + '/views/index.html');
});

userRoutes(app);
orderRoutes(app);
productRoutes(app);

//use this function to map your app to a port
app.listen(port, () => {
  console.log('server started on port: ' + port);
});

export default app;
