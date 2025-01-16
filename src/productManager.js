import { promises as fs } from 'fs';

class ProductManager{
    constructor(nombreArch) {
        this.filePath = nombreArch;
    }

    async getProducts() {
        try{
            const data = await fs.readFile(this.filePath, 'utf-8');
            const products = JSON.parse(data);
            return products.slice(1);
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
        let productBuscado = products.find(p => p.id === Number(id));
        if(productBuscado === undefined) return false;
        else return productBuscado;
    }

    async addProduct(product){
        try{      
            const data = await fs.readFile(this.filePath, 'utf-8');
            const productsFile = JSON.parse(data);   

            let productCodeRep = productsFile.slice(1).find(p => p.code === product.code)
            if(!productCodeRep && product.title && product.description && product.price && product.status && product.category && product.thumbnails && product.code && product.stock){
                const id = productsFile[0] + 1;
                const newProduct = {
                    id: id,
                    ...product,
                };
                // Actualizar el contador en la posición 0 y agregar el nuevo producto
                productsFile[0] = id;
                productsFile.push(newProduct); // Agrega el producto al array estático
                await fs.writeFile(this.filePath, JSON.stringify(productsFile, null, 2));
                console.log('Producto creado exitosamente.');
                //return newProduct;
            }else if(!(product.title && product.description && product.price && product.status && product.category && product.thumbnails && product.code && product.stock)) return console.log('Error: No estan todos los campos necesarios.');
            
            else console.error('Error: Producto con codigo ya existente.');
        }catch(error){
            console.error('Error al crear el producto.');
        }
    }

    async updateProduct(id, actualizaciones){
        //Agregar try catch?
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) {
            console.log(`Producto con el id ${id} no encontrado.`);
            return null;
        }

        products[index] = {
            ...products[index],
            ...actualizaciones,
            id, //El id no cambia
        };

        //Leer el archivo original por el contador
        const data = await fs.readFile(this.filePath, 'utf-8');
        const productsFile = JSON.parse(data);

        //Actualiza los productos nuevos en el array orig 
        productsFile.splice(1, products.length, ...products);
        await fs.writeFile(this.filePath, JSON.stringify(productsFile, null, 2));
        console.log(`Producto actualizado`);
        return products[index];
    }

    async deleteProduct(id){
        const products = await this.getProducts();
        const updatedProducts = products.filter(p => p.id !== id);
        //Retorna false si no elimino nada (no encontro el id)
        if (products.length === updatedProducts.length){
            console.log(`Producto con id ${id} no encontrado.`);
            return false;
        } 
        //Leer el archivo original por el contador
        const data = await fs.readFile(this.filePath, 'utf-8');
        const productsFile = JSON.parse(data);

        //Actualizar los productos en el archivo sin el eliminado
        productsFile.splice(1, products.length, ...updatedProducts);
        await fs.writeFile(this.filePath, JSON.stringify(productsFile, null, 2));
        console.log('Producto eliminado.');
        return true;
    }

};

export default ProductManager;