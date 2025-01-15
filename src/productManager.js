import { promises as fs } from 'fs';

class ProductManager{
    constructor(nombreArch) {
        this.filePath = nombreArch;
    }

    async getProducts() {
        try{
            const products = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(products);
        } catch(error){
            if (error.code === 'ENOENT') {
                return [];
            } else {
                console.error('Error al leer usuarios:', error);
                throw error; 
            }
        }
    }

    async getProductById(id){
        const products = await this.getProducts();
        let productBuscado = products.find(p => p.id === id);
        return productBuscado || 'Producto no encontrado.';
    }

    async addProduct(product){
        try{         
            const productsFile = await this.getProducts();
            let productCodeRep = productsFile.find(p => p.code === product.code)
            if(!productCodeRep && product.title && product.description && product.price && product.status && product.category && product.thumbnails && product.code && product.stock){
                const newProduct = {
                    id: `${Date.now()}`,
                    ...product,
                };
                productsFile.push(newProduct); // Agrega el producto al array estático
                await fs.writeFile(this.filePath, JSON.stringify(productsFile, null, 2));
                console.log('Producto creado exitosamente.');
                //return newProduct;
            }else if(!(product.title && product.description && product.price && product.status && product.category && product.thumbnails && product.code && product.stock)) return console.log('Error: No estan todos los campos necesarios.');
            
            else console.log('Error: Producto con codigo ya existente.');
        }catch(error){
            console.error('Error al crear el producto.');
        }
    }

    async updateProduct(id, actualizaciones){
        //Agregar try catch?
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        //En caso de que no exista el producto
        if(index === -1){
            console.log(`Producto con el id ${id} no encontrado.`);
            return null;
        } 
        //Si si existe
        products[index] = {
            ...products[index], //Mismos valores
            ...actualizaciones, //Pisamos valores con actualizaciones
            id, // El id no cambia
        };
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
        console.log(`Producto actualizado`);
        return products[index];
    }

    async deleteProduct(id){
        const products = await this.getProducts();
        const updatedProducts = products.filter(p => p.id !== id);
        //Retorna false si no elimino nada (no encontro el id)
        if (products.length === updatedProducts.length){
            console.log('Producto no encontrado.');
            return false;
        } 
        //Actualiza el listado si hay cambio
        await fs.writeFile(this.filePath, JSON.stringify(updatedProducts, null, 2));
        console.log('Producto eliminado.');
        return true;
    }

};

export default ProductManager;