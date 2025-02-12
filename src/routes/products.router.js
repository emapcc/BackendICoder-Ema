import { Router } from 'express';
import ProductManager from '../fileManager/productManager.js';
import productModel from '../models/product.model.js';

const router = Router();
const productManager = new ProductManager('products.json');

//Todos los productos usando paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
    const {limit = 10, page = 1, sort, query} = req.query;
    let filter = {};
    if (query) {
        filter = {category: query};
    }
    try {
        const totalProducts = await productModel.countDocuments(filter);
        const products = await productModel.find(filter)
            .sort(sort ? { price: sort === 'asc' ? 1 : -1 } : {})
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalPages = Math.ceil(totalProducts / limit);
        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? parseInt(page) + 1 : null,
            page: parseInt(page),
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/products?page=${page - 1}&limit=${limit}&query=${query}` : null,
            nextLink: page < totalPages ? `/api/products?page=${parseInt(page) + 1}&limit=${limit}&query=${query}` : null
        });
    }catch(error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

//Producto por id
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

//Agregar producto
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

//Actualizar producto
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

//Eliminar producto
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