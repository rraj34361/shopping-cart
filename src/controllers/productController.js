const { uploadFile } = require('../aws/S3');
const ProductModel = require('../models/ProductModel');
const { sizeCheck, isValid } = require('../validation/validator');
 const {isValidObjectId} = require('mongoose')

const createProduct = async (req, res) => {
    try {
        const files = req.files;
        let  { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = req.body;
        if (!title || !description || !price || !currencyId || !currencyFormat || !isFreeShipping || !style   || !installments) {
            return res.status(400).send({ status: false, message: 'Please enter all fields' });
        }
        const product = await ProductModel.findOne({ title });
        if (product) {
            return res.status(400).send({ status: false, message: 'Product Title already exists' });
        }
        if (!availableSizes) {
            return res.status(400).send({ status: false, message: 'Please enter valid sizes' });
        }

        // dikkat hai bhai
        if (!sizeCheck((availableSizes.toUpperCase().split(',')).map(e=>e.trim()))) {
            return res.status(400).send({ status: false, message: 'Please enter valid sizes' });
        }
        if (Number.isNaN(parseFloat(price))) {
            return res.status(400).send({ status: false, message: 'Please enter valid price' });
        }
        if (currencyId != "INR") {
            return res.status(400).send({ status: false, message: 'Please enter valid currency' });
        }
        if (currencyFormat != '₹') {
            return res.status(400).send({ status: false, message: 'Please enter valid currency format' });
        }
        if(!files){
            return res.status(400).send({ status: false, message: 'Please upload valid image' });

        }
        if(files){
            if (files.length === 0) {
                return res.status(400).send({ status: false, message: 'Please upload product image' });
            }
        }
        const productImage = await uploadFile(files[0]);

        const productDetail = {
            title: title,
            description: description,
            price: price,
            currencyId: currencyId,
            currencyFormat: currencyFormat,
            isFreeShipping: isFreeShipping,
            productImage: productImage,
            style: style,
            availableSizes: (availableSizes.toUpperCase().split(',')).map(e=>e.trim()),
            installments: installments
        }
        //  let   availableSizes = (availableSizes.toUpperCase().split(',')).map(e=>e.trim())
        // const productDetail = {...req.body, productImage : productImage , availableSizes :availableSizes }
        const newProduct = await ProductModel.create(productDetail);
       return res.status(201).send({ status: true, message: 'Product Created', data: newProduct });
    } catch (error) {
            return res.status(500).send({ status: false, message: error.message });
    }
}

const getProduct = async (req, res) => {
    try {
        const { size, priceSort, name, priceGreaterThan, priceLessThan } = req.query;
        const filterDetail = { isDeleted: false };
        if (size) {
            filterDetail.availableSizes = size;
        }
        if (name) {
            filterDetail.title = { $regex: name, $options: 'i' };
        }
        if (priceGreaterThan) {
            filter.price = { $gt: parseFloat(priceGreaterThan) };
        }
        if (priceLessThan) {
            filter.price = { ...filter.price, $lt: parseFloat(priceLessThan) };
        }
        let sortOption = {};
        if (priceSort) {
            sortOption.price = JSON.parse(parseInt(priceSort));
        }
        const products = await ProductModel.find(filterDetail).sort(sortOption);
        if(products.length === 0){
            return res.status(404).send({ status: false, message: 'Products not found' });
        }
     return   res.status(200).send({ status: true, message: 'Products found', data: products });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}
const getProductById = async (req, res) => {
    try {
        const productId = req.params.productId;

        if(! isValidObjectId(productId)){
            return res.status(400).send({status: false, message: 'Invalid productId' });
        }
        const product = await ProductModel.findOne({_id:productId, isDeleted: false}); 
        if(! product){
            return res.status(404).send({status: false, message: 'Product not found' });
        }
       return res.status(200).send({ status: true, message: 'Product found', data: product });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

// can we update all fields in product
const updateProduct = async (req, res) => {
    try {
        const {title} = req.body;
        const productId = req.params.productId;
        if(! isValidObjectId(productId)){
            return res.status(400).send({status: false, message: 'Invalid productId' });
        }
        const product = await ProductModel.findOne({_id: productId, isDeleted: false});
        if(! product){
            return res.status(404).send({status: false, message: 'Product not found' });
        }
        if(( Object.keys(req.body)).length === 0 && !req.files ){
            return res.status(400).send({status: false, message: 'Please enter data' });
        }
       if(req.files){
        if(req.files.length>0){
            const url = await uploadFile(req.files[0]);
            req.body.productImage = url;
        }
       }
        if(title){
            if(!isValid(title)){
                return res.status(400).send({status: false, message: 'invalid title'});

            }
            const titleCheck = await ProductModel.findOne({title : title });  // doubt for isDeleted
            if(titleCheck){
                return res.status(400).send({status: false, message: 'Product title already exists'});
            }
            else{
                req.body.title = title;
            }
        }

        const updatedProduct = await ProductModel.findOneAndUpdate({_id:productId, isDeleted: false}, {$set : req.body}, {new: true});
         
       return  res.status(200).send({ status: true, message: 'Product updated', data: updatedProduct });
    } catch (error) {

        return    res.status(500).send({ status: false, message: error.message });
    }
}

const deletedProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        if(!isValidObjectId(productId)){
            return res.status(400).send({status: false, message: 'Invalid productId' });
        }
        const product = await ProductModel.findOne({_id:productId, isDeleted: false});
        if(! product){
            return res.status(404).send({status: false, message: 'Product not found' });
        }
        product.isDeleted = true;
        product.deletedAt = new Date();
        await product.save();
       return res.status(200).send({ status: true, message: 'Product deleted' });
    } catch (error) {
     return   res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = {
    createProduct, getProduct, getProductById, updateProduct, deletedProduct
}
