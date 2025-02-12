import mongoose from 'mongoose';

const {Schema} = mongoose;
const productCollection = 'products';

//Definición de esquema del producto
const productSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    code: {type: String, required: true, index: true},
    price: {type: Number, required: true},
    status: {type: Boolean, default: true },
    stock: {type: Number, required: true},
    category: {type: String, required: true},
    thumbnails: { type: [String], default: ["Sin imagen"] }
});

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;