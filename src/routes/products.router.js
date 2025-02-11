import { Router } from 'express';
import ProductManager from '../fileManager/productManager.js';
import product from '../models/product.model.js';

const router = Router();
const productManager = new ProductManager('products.json');

//Todos los productos
/* router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
}); */
//Todos los productos usando paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
    const {limit = 10, page = 1, sort, query} = req.query;
    let filter = {};
    if (query) {
        filter = {category: query};
    }
    try {
        const totalProducts = await product.countDocuments(filter);
        const products = await product.find(filter)
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
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
});

//Agregar producto
router.post('/', async (req, res) => {
    let { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
    price = Number(price);
    stock = Number(stock);
    const newProduct = await productManager.addProduct({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    });
    if(!newProduct) return res.status(404).json({ message: 'Error al crear el producto.' });
    res.status(201).json(newProduct);
});

//Actualizar producto
router.put('/:pid', async (req, res) => {
    //Toma las actualizaciones
    const { id, ...actualizaciones } = req.body; // No permitir actualizar el id
    const prodAct = await productManager.updateProduct(req.params.pid, actualizaciones);
    if (!prodAct) return res.status(404).json({ message: `Error: Producto con id ${req.params.pid} no encontrado.` });
    res.json(prodAct);
});

//Eliminar producto
router.delete('/:pid', async (req, res) => {
    const deleted = await productManager.deleteProduct(req.params.pid);
    if (!deleted) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(204).send();
});

export default router;