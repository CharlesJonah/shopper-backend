
const Product = require('../../server/models/product'); // get our mongoose model
const app = require('../../app')


module.exports = {
    createProducts(req, res) {
        if (req.body.name && req.body.quantity && req.body.price && req.body.unit && req.body.unit_price && req.body.description) {

            const product = new Product(req.body);
            product.created_by = req.decoded.email
            product.save(function (err) {
                if (err) {
                    res.status(500).send({ success: false, message: err });
                }
                else {
                    res.status(201).send({ success: true, message: 'Product added successfully' });
                }
            });
        }
        else {
            res.status(400).send({ success: true, message: 'Bad Request. Fill all the fields' });
        }
    },
    getAllProductsPublicAcess(req, res) {
        Product.find({}, function (err, task) {
            if (err)
                res.status(500).send({ success: false, message: err });
            res.status(200).send({ success: true, message: task });
        });
    },
    getAllProducts(req, res) {
        Product.find({ created_by: req.decoded.email }, function (err, task) {
            if (err)
                res.status(500).send({ success: false, message: err });
            res.status(200).send({ success: true, message: task });
        });
    },
    getProduct(req, res) {
        Product.findById({ _id: req.params.id, created_by: req.decoded.email }, function (err, task) {
            if (err)
                res.status(500).send({ success: false, message: err });
            res.status(200).send({ success: true, message: task });
        });
    },
    updateProduct(req, res) {
        Product.findOneAndUpdate({ _id: req.params.id, created_by: req.decoded.email }, req.body, { new: true }, function (err, task) {
            if (err)
                res.status(500).send({ success: false, message: err });
            res.status(200).send({ success: true, message: task });
        });

    },
    getApiData(req, res) {
        res.status(200).send({ challenge: req.body.challenge });
        console.log(req.body.event.type, req.body.type, req)
    },
    deleteProduct(req, res) {
        Product.remove({ _id: req.params.id, created_by: req.decoded.email }, function (err, task) {
            if (err)
                res.status(500).send({ success: false, message: err });
            res.status(200).send({ success: true, message: 'Product deleted successfully' });
        });
    }
}