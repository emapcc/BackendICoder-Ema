import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import ProductManager from './fileManager/productManager.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import methodOverride from 'method-override';

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log("Escuchando en el puerto ", PORT));

dotenv.config();
const URIMongoDB = process.env.URIMONGODB;

mongoose.connect(URIMongoDB)
    .then(() => console.log('Conexión a la base de datos exitosa.'))
    .catch((error) => {
        console.error('Error al conectarse a la base de datos: ', error);
        process.exit();
    })

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine()); 
app.set('views', __dirname + '/views'); 
app.set('view engine', 'handlebars');

app.use(methodOverride('_method'));

app.use('/api/products', productsRouter);

app.use('/api/carts', cartsRouter);

app.use('/', viewsRouter);

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
});