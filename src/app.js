import express from 'express';
import ProductManager from './productManager.js'

const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => console.log("Server listening on port ", PORT));

//Para el req.body
app.use(express.json());

const productManager = new ProductManager('products.json');

//Todos los productos
app.get('/products', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

//Producto por id
app.get('/products/:pid', async (req,res) => {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
});

//Agregar producto
app.post('/products', async (req, res) => {
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
    res.status(201).json(newProduct);
});

//Actualizar producto
app.put('/products/:pid', async (req, res) => {
    //Toma las actualizaciones
    const { id, ...actualizaciones } = req.body; // No permitir actualizar el id
    const prodAct = await productManager.updateProduct(req.params.pid, actualizaciones);
    if (!prodAct) return res.status(404).json({ message: `Error: Producto con id ${req.params.pid} no encontrado.` });
    res.json(prodAct);
});

//Eliminar producto
app.delete('/products/:pid', async (req, res) => {
    const deleted = await productManager.deleteProduct(req.params.pid);
    if (!deleted) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(204).send();
});