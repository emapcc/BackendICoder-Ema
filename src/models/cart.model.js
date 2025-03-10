import mongoose from "mongoose";

const {Schema} = mongoose;
const cartCollection = 'carts';

const cartSchema = new Schema({
    products:{
        type: [{
            product: {
                type: Schema.Types.ObjectId, 
                ref: 'products'
            },
            quantity: {type: Number, default: 1}
        }],
        default: []
    }
})

cartSchema.pre(/^find/, function(){
    this.populate('products.product');
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;