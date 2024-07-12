const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            count: Number,
            size: String,
            price: Number
        }
    ],
    cartTotal: Number,
    totalAfterDiscount: {
        type: Number,
        default: 0
    },
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
    {
        timestamps: true
    }
);

//Export the model
module.exports = mongoose.model('Cart', cartSchema);