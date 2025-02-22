import { Router } from 'express';
import ProductManager from '../fileManager/productManager.js';
import productModel from '../models/product.model.js';

const router = Router();
const productManager = new ProductManager('products.json');

router.get('/', async (req, res) => {
    const {limit = 10, page = 1, sort, query} = req.query;
    let filter = {};
    if (query) {
        filter = {category: query};
    }
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
    };
    try {
        const products = await productModel.paginate(filter, options);
        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&limit=${limit}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&limit=${limit}&query=${query}` : null
        });
    }catch(error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/:pid', async (req,res) => {
    const pid = req.params.pid;
    try {
        const product = await productModel.findById({_id: pid})
        if(!product)
            res.status(404).json({message: `Producto con id ${pid} no encontrado.`})
        res.json(product);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/', async (req, res) => {
    let { title, description, code, price, stock, category} = req.body;
    if(!title || !description || !code || !price || !stock || !category)
        return res.status(400).json({message: 'Campos incompletos.'});
    try {
        const codeRep = await productModel.findOne({code: code});
        if(codeRep)
            return res.status(400).send('Producto con código ya existente.');
        const newProduct = await productModel.create({
            title,
            description,
            code,
            price,
            stock,
            category
        });
        res.status(201).json({status: 'success', payload: newProduct});
    } catch (error) {
        res.status(500).json({message: 'Error al crear el producto.', error: error });
    }
});

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const productUpdate = req.body;
    if(!productUpdate.title || !productUpdate.description || !productUpdate.code || !productUpdate.price || !productUpdate.stock || !productUpdate.category)
        return res.status(400).json({message: 'Campos incompletos.'});
    try {
        const update = await productModel.updateOne({_id: pid}, productUpdate);
        res.json({status: 'success', payload: update});
    } catch (error) {
        res.status(500).json({message: 'Error al actualizar el producto.', error: error });
    }
});

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    try {
        const product = await productModel.findOne({_id: pid});
        if(!product)
            return res.status(400).json({message: `Producto con id ${pid} no encontrado.`});
        const deleted = await productModel.deleteOne({_id: pid});
        res.json({status: 'success', payload: deleted});
    } catch (error) {
        res.status(500).json({message: 'Error al borrar el producto.', error: error });
    }
});

export default router;