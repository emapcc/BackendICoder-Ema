import { Router } from 'express';
import ProductManager from '../productManager.js';

const router = Router();
const productManager = new ProductManager('products.json');

//Todos los productos
router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

//Producto por id
router.get('/:pid', async (req,res) => {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
});

//Agregar producto
router.post('/', async (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
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