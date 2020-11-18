const { Users } = require('../app/Users/Schema');
const ObjectId = require('mongodb').ObjectId;
const { Products } = require('../app/Products/Schema');
const ResponseMessages = require('./ResponseMessages.json');

class CommonServices {

    static async validateUser(req, res, next) {
        // return new Promise(async (resolve, reject) => {
        try {
            console.log(`body ::: `, req.body);
            if (!req.body.userId) { return res.send({ status: 0, message: ResponseMessages.SEND_USERID }) }
            if (!ObjectId.isValid(req.body.userId)) { return res.send({ status: 0, message: ResponseMessages.SEND_VALID_USERID, data: {} }) }
            let fetchUser = await Users.findOne({ _id: ObjectId(req.body.userId), status: true, isDeleted: false }).exec();
            if (!fetchUser) {
                return res.send({ status: 0, message: ResponseMessages.USER_NOT_FOUND, data: {} });
            }
            req.currentUser = fetchUser;
            next();
            // })
        } catch (error) {
            console.error(`error :: `, error);
            return res.send({ status: 0, message: error })
        }
    }

    static checkProductId(req, res, next) {
        // return new Promise(async (resolve, reject) =
        try {
            if (!req.body.productId) { return res.send({ status: 0, message: ResponseMessages.SEND_PRODUCTID, data: {} }) }
            if (!ObjectId.isValid(req.body.productId)) { return res.send({ status: 0, message: ResponseMessages.SEND_VALID_PRODUCTID, data: {} }) }
            req.currentUser = fetchUser;
            next();
            // })
        } catch (error) {
            console.error(`error :: `, error);
            return res.send({ status: 0, message: error })
        }
    }

    static async addDataIntoDB() {
        let findProdutsCount = await Products.countDocuments();
        console.log("findProdutsCount ::: ", findProdutsCount);
        if (!findProdutsCount) {
            await Products.insertMany([
                {
                    productName: "abc",
                    prize: "25",
                    quantity: "10"
                },
                {
                    productName: "def",
                    prize: "25",
                    quantity: "10"
                }, {
                    productName: "testProduct",
                    prize: "100",
                    quantity: "8"
                }, {
                    productName: "demoProduct",
                    prize: "300",
                    quantity: "5"
                }
            ]);
        }
        return;
    }
}

module.exports = CommonServices