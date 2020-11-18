// let express = require('express');
module.exports = (app, express) => {
    let router = express.Router();
    let ProductController = require('./Controller');
    let commonServices = require('../../configs/CommonServices');
    router.post('/addProductToCart',
        // commonServices.validateUser,
        //  commonServices.checkProductId,
        (req, res, next) => {
            const productObj = new ProductController(req, res);
            return productObj.addProductToCart();
        });

    router.get('/getProduct', commonServices.validateUser, commonServices.checkProductId, (req, res) => {
        const productObj = new ProductController(req, res);
        return productObj.getProduct();
    });

    router.put('/editProduct', commonServices.validateUser, commonServices.checkProductId, (req, res) => {
        const productObj = new ProductController(req, res);
        return productObj.editProduct();
    });

    router.delete('/deleteProduct', commonServices.validateUser, commonServices.checkProductId, (req, res) => {
        const productObj = new ProductController(req, res);
        return productObj.deleteProduct();
    });

    router.get('/listCartProducts', (req, res, next) => {
        const productObj = new ProductController(req, res);
        return productObj.listCartProducts();
    });
    app.use(router);



}