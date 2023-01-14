"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./middlewares/logger"));
const order_1 = __importDefault(require("./handlers/order"));
const user_1 = __importDefault(require("./handlers/user"));
const product_1 = __importDefault(require("./handlers/product"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 3000;
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
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
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification));
/*
const outputFile = '../swagger_output.json'
const endpointsFiles = [userRoutes, orderRoutes, productRoutes];

const swaggerAutogen = require('swagger-autogen')()
swaggerAutogen(outputFile, endpointsFiles)

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('swagger_output.json');
*/
app.use(body_parser_1.default.json());
//app.use a list of your custom middlewares
app.use([logger_1.default]);
//app.Method takes two parameters, URI and callback function
//callback function takes request and response objects as parameters
app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});
(0, user_1.default)(app);
(0, order_1.default)(app);
(0, product_1.default)(app);
//use this function to map your app to a port
app.listen(port, () => {
    console.log('server started on port: ' + port);
});
exports.default = app;
