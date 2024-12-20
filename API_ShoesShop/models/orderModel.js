const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            count: Number,
            size: String
        }
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Pending",
        enum: [
            "Unpaid",
            "Pending",
            "Shipping",
            "Cancelled",
            "Delivered"
        ]
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
module.exports = mongoose.model('Oder', orderSchema);