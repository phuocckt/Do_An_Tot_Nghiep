const mongoose = require("mongoose");

var productSchena = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true
        },
        slug:{
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        description:{
            type: String,
            required: true,
        },
        price:{
            type: Number,
            required: true
        },
        category:{
            type: mongoose.Schema.Types.ObjectId, ref: "Category" 
        },
        brand:{
            type: mongoose.Schema.Types.ObjectId, ref: "Brand" 
        },
        quantity:{
            type: Number,
            required: true
        },
        sold:{
            type: Number,
            default: 0
        },
        images:[],
        colors:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Color"
            }
        ],
        size:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Size"
            }
        ],
        ratings:[
            {
                star: Number,
                comment: String,
                postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
            }
        ],
        totalrating:{
            type: Number,
            default: 0
        }
    }, 
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Product', productSchena);