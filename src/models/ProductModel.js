const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    currencyId: {
        type: String,
        required: true,
    },
    currencyFormat: {
        type: String,
        required: true,
        Symbol: '₹',
    },
    isFreeShipping: {
        type: Boolean,
        default: false,
    },
    productImage: {
        type: String,
        required: true,
    },
    style: {
        type: String,
    },
    availableSizes: {
        type: Array(String),
        required: true,
        enum: ["S", "XS", "M", "X", "L", "XXL", "XL"],
    },
    installments: {
        type: Number,
    },
    deletedAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);


 