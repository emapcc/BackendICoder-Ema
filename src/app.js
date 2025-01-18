import express from 'express';
import CartManager from './cartManager.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js'

const app = express();
const PORT = 8080;

//Middleware 
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const cartManager = new CartManager('carts.json');

//PRODUCTOS 
app.use('/api/products', productsRouter);

//CARRITO
app.use('/api/carts', cartsRouter);

const server = app.listen(PORT, () => console.log("Escuchando en el puerto ", PORT));