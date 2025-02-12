import {Router} from 'express';
import { promises as fs } from 'fs';
import cartModel from '../models/cart.model.js';

const viewsRouter = Router();

const getProducts = async () => {
    const data = await fs.readFile('products.json', 'utf-8');
    const products = JSON.parse(data);
    const productsTotales = products.slice(1);
    return productsTotales;
}

viewsRouter.get('/products', async (req, res) => {
    const products = await getProducts();
    res.render('index', {
        products,
        style: 'main.css'
    });
})

viewsRouter.get('/realtimeproducts', async (req, res) => {
    const products = await getProducts();
    
    res.render('realtimeproducts', {
        products,
        style: 'main.css'});
})

viewsRouter.get('/carts/:cid', async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await cartModel.findById(cid).lean(); //lean() convierte el objeto de Mongoose en un objeto JavaScript plano, eliminando el problema de propiedades heredadas
        const products = cart.products;
        res.render('cart', {
            cid,
            products,
            style: 'main.css'
        });
    } catch (error) {
        res.status(500).json({ status: 'Error al buscar carrito.', message: error.message });
    }
})

export default viewsRouter;