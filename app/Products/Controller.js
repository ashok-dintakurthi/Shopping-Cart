const { Products } = require('./Schema');
const { Users } = require('../Users/Schema');

const ObjectId = require('mongodb').ObjectId;
const ResponseMessages = require('../../configs/ResponseMessages');

class ProductController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async addProductToCart() {
        try {
            let fetchProduct = await Products.findOne({ _id: ObjectId(this.req.body.userId), status: true, isDeleted: false }).exec();
            if (!fetchProduct) { return this.res.send({ status: 0, message: ResponseMessages.PRODUCT_NOT_FOUND, data: {} }); }
            let addProductToUserCart = await Users.findByIdAndUpdate(this.req.currentUser._id, { $addToSet: { cart: { productId: fetchProduct._id, userQuantity: 1 } } }).exec();
            if (!addProductToUserCart) { return this.res.send({ status: 0, message: ResponseMessages.PRODUCT_NOT_ADDED, data: {} }); }
            return this.res.send({ status: 1, message: ResponseMessages.PRODUCT_ADDED_SUCCESSFULLY, data: {} });
        } catch (error) {
            console.error(`error :: `, error);
            return this.res.send({ status: 0, message: error })
        }
    }

    async getProduct() {
        try {
            let fetchProduct = await Products.findOne({ _id: ObjectId(this.req.body.userId), status: true, isDeleted: false }).select('productName quantity prize').exec();
            if (!fetchProduct) { return this.res.send({ status: 0, message: ResponseMessages.PRODUCT_NOT_FOUND, data: {} }); }
            fetchProduct
            this.req.currentUser.cart.forEach(element => {
                if (String(element.productId) == String(fetchProduct._id)) { fetchProduct.userQuantity = element.userQuantity; }
            });
            return this.res.send({ status: 1, message: ResponseMessages.PRODUCT_DETAILS, data: { fetchProduct } });
        } catch (error) {
            console.error(`error :: `, error);
            return this.res.send({ status: 0, message: error })
        }
    }

    async editProduct() {
        try {
            let fetchProduct = await Products.findOne({ _id: ObjectId(this.req.body.productId), status: true, isDeleted: false }).select('productName quantity prize').exec();
            if (!fetchProduct) { return this.res.send({ status: 0, message: ResponseMessages.PRODUCT_NOT_FOUND, data: {} }); }
            if (this.req.body.quantity > fetchProduct.quantity) {
                return this.res.send({ status: 0, message: ResponseMessages.PRODUCT_QUANTITY_LIMIT_EXCEEDED, data: {} });
            }
            await Users.findOneAndUpdate({ _id: this.req.currentUser._id, 'cart.productId': fetchProduct._id }, { $set: { 'cart.$.userQuantity': this.req.body.quantity } });
            return this.res.send({ status: 1, message: ResponseMessages.PRODUCT_DETAILS_UPDATED, data: { fetchProduct } });
        } catch (error) {
            console.error(`error :: `, error);
            return this.res.send({ status: 0, message: error })
        }
    }

    async deleteProduct() {
        try {
            let fetchProduct = await Products.findOne({ _id: ObjectId(this.req.body.userId), status: true, isDeleted: false }).select('productName quantity prize').exec();
            if (!fetchProduct) { return this.res.send({ status: 0, message: ResponseMessages.PRODUCT_NOT_FOUND, data: {} }); }
            await Users.findByIdAndUpdate(this.req.currentUser._id, { $pull: { cart: this.req.body.productId } });
            return this.res.send({ status: 1, message: ResponseMessages.PRODUCT_DELETED, data: {} });
        } catch (error) {
            console.error(`error :: `, error);
            return this.res.send({ status: 0, message: error })
        }
    }

    async listCartProducts() {
        try {
            if (!this.req.currentUser.cart.length) { return this.res.send({ status: 1, message: ResponseMessages.CART_EMPTY }) }
            let productsList = [], productDetails = {};
            this.req.currentUser.cart.forEach(async (element) => {
                productDetails = await Products.findById(ObjectId(element.productId)).select('productName quantity prize');
                productDetails.userQuantity = element.userQuantity;
                productsList.push(productDetails);
                productDetails = {};
            });
            return this.res.send({ status: 1, message: ResponseMessages.CART_LIST, data: { productsList } })
        } catch (error) {
            console.error(`error :: `, error);
            return this.res.send({ status: 0, message: error })
        }
    }
}

module.exports = ProductController;