import { promises as fs } from 'fs';

class CartManager{
    constructor(nombreArch) {
        this.filePath = nombreArch;
    }

    async getCarts(){
        try{
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch{
            return [];
        }
    }

    async getCartById(id){
        const carts = await this.getCarts();
        let cartBuscado = carts.find(c => c.id === Number(id));
        if(cartBuscado === -1) return false;
        return cartBuscado;
    }

    async addCart(){
        const carts = await this.getCarts();
        const id = carts[0] + 1;
        const newCart = {
            id: id,
            products: []
        };
        carts[0] = id;
        carts.push(newCart);
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProductCart(idCart, idProd){
        const productsRaw = await fs.readFile('products.json', 'utf-8');
        const products = JSON.parse(productsRaw);
        const product = products.slice(1).find(p => p.id === Number(idProd));
        if(product === undefined){
            console.error('Error: Producto no encontrado');
            return false
        }
        else{
            try{
                const carts = await this.getCarts();
                const idC = Number(idCart);
                const idP = Number(idProd);

                const cartIndex = carts.slice(1).findIndex(c => c.id === idC);
                if(cartIndex === -1){
                    console.log(`Carrito con el id ${idC} no encontrado.`);
                    return null
                }
                const cart = carts[cartIndex+1]
                const idProductInCartRep = cart.products.findIndex(p => p.product === idP);
                if(idProductInCartRep !== -1)
                    cart.products[idProductInCartRep].quantity += 1;
                else
                    cart.products.push({product: idP, quantity: 1});
        
                carts[cartIndex+1] = cart;
        
                await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
                console.log(`Producto ${idP} agregado al carrito ${idC}.`);
                return cart;
            } catch(error){
                console.error('Error al agregar producto al carrito:', error);
            }
        }
    }
}

export default CartManager;