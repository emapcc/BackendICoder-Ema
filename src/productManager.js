class ProductManager{
    static products = [];
    static contador = 0;
    
    constructor(title, description, price, thumbnail, code, stock){
        this.id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }

    addProduct(product) {
        let productCodeRep = ProductManager.products.find(p => p.code === product.code)
        if(!productCodeRep && product.title && product.description && product.price && product.thumbnail && product.code && product.stock){
            ProductManager.contador++; // Incrementa el contador
            const newProduct = { ...product, id: ProductManager.contador }; // Crea un nuevo producto con el id
            ProductManager.products.push(newProduct); // Agrega el producto al array estático
            console.log('Producto creado exitosamente.');
        }else if(!(product.title && product.description && product.price && product.thumbnail && product.code && product.stock)) return console.log('Error: No estan todos los campos necesarios.');
        
        else console.log('Error: Producto con codigo ya existente.');
        
    }

    getProducts(){
        return ProductManager.products;
    }

    getProductById(id){
        let productBuscado = ProductManager.products.find(p => p.id === id);
        return productBuscado || 'Producto no encontrado.';
    }
};

const manager = new ProductManager();

console.log(manager.getProducts());

//Creacion de producto
manager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock:25
});
//Producto repetido
manager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock:25
});
//Producto con campo faltante
manager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
});

console.log(manager.getProducts());

console.log('PRODUCTO BUSCADO');
//Busca producto existente
console.log(manager.getProductById(1));
//Busca producto no incluido
console.log(manager.getProductById(5));

export default ProductManager;