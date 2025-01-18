import { Router } from 'express';
import CartManager from '../cartManager.js';

const router = Router();
const cartManager = new CartManager('carts.json');

//Crear carrito
router.post('/', async (req, res) => {
    const newCart = await cartManager.addCart();
    if(!newCart) return res.status(404).json({message: 'No se pudo crear un carrito'})
    res.status(201).json(newCart);
})

//Obtener un carrito por su id
router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    if(!cart){
        console.error(`Carrito con id ${req.params.cid} no encontrado.`);
        return res.status(404).json({message: `Carrito con id ${req.params.cid} no encontrado.`});
    }
    res.json(cart.products);
})

//Agregar un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    const updatedCart = await cartManager.addProductCart(req.params.cid, req.params.pid);
    if (!updatedCart) return res.status(404).json({ message: 'Carrito o producto no encontrado' });
    res.status(201).json(updatedCart);
})

export default router;