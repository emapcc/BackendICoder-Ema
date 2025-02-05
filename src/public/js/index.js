const socket = io();
socket.emit('message', "¡Hola, me estoy comunicando desde un websocket!");

const form = document.getElementById('form');

form.addEventListener('submit', (event)=>{
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const code = document.getElementById('code').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    const newProduct = {
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: "Sin imagen"
    }
    socket.emit('newProduct', newProduct);
    
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('code').value = '';
    document.getElementById('price').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('category').value = '';
});

socket.on('loadProducts', products => {
    console.log('Cargando productos');
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = '';
    if(products.length>0){
        products.forEach(product => {
            productsContainer.innerHTML += `
                <li id="product-${product.id}">
                    ${product.title} - ${product.price}$ 
                    <button onclick="deleteProduct('${product.id}')">Eliminar</button>
                </li>`;
        });
    } else{
        productsContainer.innerHTML += `<p>No hay productos</p>`
    }
});

function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}