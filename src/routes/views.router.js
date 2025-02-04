import {Router} from 'express';
import { promises as fs } from 'fs';

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

export default viewsRouter;