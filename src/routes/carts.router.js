import { Router } from 'express';
import CartManager from '../fileManager/cartManager.js';
import cartModel from '../models/cart.model.js'
import productModel from '../models/product.model.js';

const router = Router();
const cartManager = new CartManager('carts.json');

router.post('/', async (req, res) => {
    try {
        const newCart = await cartModel.create({});
        res.status(201).json({status: 'success', payload: newCart});
    } catch (error) {
        res.status(500).json({message: 'Error al crear el carrito.', error: error.message });
    }
})

router.get('/:cid', async (req,res) => {
    try {
        const cartBuscado = await cartModel.findById({_id: req.params.cid});
        if(!cartBuscado){
            console.error(`Carrito con id ${req.params.cid} no encontrado.`);
            return res.status(404).json({message: `Carrito con id ${req.params.cid} no encontrado.`});
        }
        if(cartBuscado.products.length === 0){
            return res.json({message: `Carrito con id ${req.params.cid} vacio.`});
        }
        res.json(cartBuscado.products);
    } catch (error) {
        res.status(500).json({ status: 'Error al obtener el carrito.', message: error.message });
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const cartBuscado = await cartModel.findById({_id: cid});
        if(!cartBuscado)
            return res.json({message: `Carrito con id ${cid} no encontrado.`});
        const prodBuscado = await productModel.findById({_id: pid});
        if(!prodBuscado)
            return res.json({message: `Producto con id ${pid} no encontrado.`});
        const prodExistenteIndex = cartBuscado.products.findIndex(item => item.product._id.toString() === pid);
        if(prodExistenteIndex !== -1)
            cartBuscado.products[prodExistenteIndex].quantity += 1;
        else
            cartBuscado.products.push({ product: pid, quantity: 1 });
        await cartBuscado.save();
        res.json({status: 'success', payload: cartBuscado});
    } catch (error) {
        res.status(500).json({ status: 'Error al agregar producto al carrito.', message: error.message });
    }
})

router.delete('/:cid/products/:pid', async (req,res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const cartBuscado = await cartModel.findById({_id: cid});
        if(!cartBuscado)
            return res.json({message: `Carrito con id ${cid} no encontrado.`});
        cartBuscado.products = cartBuscado.products.filter(item => item.product._id.toString() !== pid);
        await cartBuscado.save();
        res.json({status: 'success', payload: cartBuscado});
    } catch (error) {
        res.status(500).json({ status: 'Error al eliminar producto del carrito.', message: error.message });
    }
})

router.put('/:cid', async (req,res) => {
    const cid = req.params.cid;
    const products = req.body;
    try {
        const cartBuscado = await cartModel.findById({_id: cid});
        if(!cartBuscado)
            return res.json({message: `Carrito con id ${cid} no encontrado.`});
        const updatedCart = await cartModel.findByIdAndUpdate(cid, { products }, { new: true });
        res.json({ status: 'success', updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'Error al actualizar productos del carrito.', message: error.message });
    }
})

router.put('/:cid/products/:pid', async (req,res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body;
    try {
        const cartBuscado = await cartModel.findById({_id: cid});
        if(!cartBuscado)
            return res.json({message: `Carrito con id ${cid} no encontrado.`});
        const prodBuscado = await productModel.findById({_id: pid});
        if(!prodBuscado)
            return res.json({message: `Producto con id ${pid} no encontrado.`});
        const prodExistenteIndex = cartBuscado.products.findIndex(item => item.product._id.toString() === pid);
        if(prodExistenteIndex !== -1)
            cartBuscado.products[prodExistenteIndex].quantity = Number(quantity);
        await cartBuscado.save();
        res.json({status: 'success', payload: cartBuscado});
    } catch (error) {
        res.status(500).json({ status: 'Error al actualizar cantidad del producto en el carrito.', message: error.message });
    }
})

router.delete('/:cid', async (req, res) => {
    const cid = req.params.cid;
    try {
        const emptyCart = await cartModel.findById(cid);
        emptyCart.products = [];
        await emptyCart.save();
        res.json({status: 'success', payload: emptyCart});
    } catch (error) {
        res.status(500).json({ status: 'Error al eliminar productos del carrito.', message: error.message })
    }
})

export default router;