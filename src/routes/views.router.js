import {Router} from 'express';
import { promises as fs } from 'fs';
import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js'

const viewsRouter = Router();

const getProducts = async () => {
    const data = await fs.readFile('products.json', 'utf-8');
    const products = JSON.parse(data);
    const productsTotales = products.slice(1);
    return productsTotales;
}

viewsRouter.get('/products', async (req, res) => {
    let {limit = 10, page = 1, sort, query} = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    let filter = {};
    if(query){
        filter = {category: query};
    }
    const options = {
        page,
        limit,
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
    };
    try {
        const products = await productModel.paginate(filter, options);
        const productsDocs = products.docs.map(doc => doc.toObject());
        
        res.render('index', {
            products: productsDocs,
            page: products.page,
            query,
            limit,
            nextPage: products.hasNextPage,
            prevPage: products.hasPrevPage,
            numberPrev: products.hasPrevPage ? products.prevPage : undefined,
            numberSig: products.hasNextPage ? products.nextPage : undefined,
            style: 'main.css'
        });
    } catch (error) {
        res.status(500).json({ status: 'Error al buscar productos.', message: error.message });
    }
})

viewsRouter.get('/product/:pid', async (req, res) =>{
    const pid = req.params.pid;
    try {
        const product = await productModel.findById(pid).lean();
        res.render('product', {
            product,
            style: 'main.css'
        });
    } catch (error) {
        res.status(500).json({ status: 'Error al buscar producto.', message: error.message });
    }
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

viewsRouter.get('/newProduct', async (req, res) => {
    res.render('newProduct', {
        style: 'main.css'
    })
})

export default viewsRouter;