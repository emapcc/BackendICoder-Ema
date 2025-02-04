import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import {promises as fs} from 'fs';
import ProductManager from './fileManager/productManager.js';

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log("Escuchando en el puerto ", PORT));

//Middleware 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Configuracion archiovos estaticos
app.use(express.static(__dirname + '/public'));

//Configuracion de plantillas handlebars
app.engine('handlebars', handlebars.engine()); 
app.set('views', __dirname + '/views'); 
app.set('view engine', 'handlebars');

//PRODUCTOS 
app.use('/api/products', productsRouter);

//CARRITO
app.use('/api/carts', cartsRouter);

//VISTAS
app.use('/', viewsRouter);

//Sockets
const socketServer = new Server(httpServer); 

const productManager = new ProductManager('products.json');

socketServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado.');

    socket.on('newProduct', async product => {
        await productManager.addProduct(product);
        const products = await productManager.getProducts();
        socketServer.emit('loadProducts', products);
    });

    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id);
        const products = await productManager.getProducts();
        socketServer.emit('loadProducts', products);
    });

    /*socket.on('newProduct', async product => {
        const data = await fs.readFile(this.filePath, 'utf-8');
        const productsFile = JSON.parse(data); 
        const newProduct = {socketId : socket.id, ...product};
        console.log('Producto creadooooo');
        
        products.push(newProduct);
        socketServer.emit('loadProducts', newProduct);
    });*/
});