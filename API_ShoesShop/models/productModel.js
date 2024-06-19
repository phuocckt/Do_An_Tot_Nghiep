const mongoose = require("mongoose");

var productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        description: {
            type: String
        },
        priceOld: {
            type: Number
        },
        price: {
            type: Number,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId, ref: "Category"
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId, ref: "Brand"
        },
        quantity: {
            type: Number,
            required: true
        },
        sold: {
            type: Number,
            default: 0
        },
        image: [{
            public_id: String,
            url: String
        }],
        variants: [
            {
                size: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Size"
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        ratings: [
            {
                star: Number,
                comment: String,
                postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
            }
        ],
        totalrating: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Product', productSchema);
