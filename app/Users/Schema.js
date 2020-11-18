const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

let usersSchema = new Schema({
    username: { type: String },
    emailId: { type: String, unique: true, required: true, trim: true },
    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    cart: [{ productId: { type: Schema.Types.ObjectId, ref: 'products' }, userQuantity: { type: Number } }]
},
    {
        timestamps: true
    });

let Users = mongoose.model('users', usersSchema);

module.exports = { Users }