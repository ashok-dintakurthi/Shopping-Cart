const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');
let typeString = { type: String };

let productsSchema = new Schema({
    productName: typeString,
    prize: typeString,
    quantity: typeString,
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    // userId: { type: Schema.Types.ObjectId }
},
    {
        timestamps: true
    });

let Products = mongoose.model('products', productsSchema);

module.exports = { Products }