
const CartModel = require('../models/CartModel');
const UserModel = require('../models/UserModel');
const ProductModel = require('../models/ProductModel');
const { isValid, unique } = require("../validation/validator");
const mongoose = require('mongoose')
const { isValidObjectId } = mongoose;




const createCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { productId,  cartId } = req.body;
    
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: 'Invalid userId' });
        }
        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: 'Invalid productId' });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found' });
        }
        const product = await ProductModel.findOne({ _id: productId, isDeleted: false });
        if (!product) {
            return res.status(404).send({ status: false, message: 'Product not found' });
        }
        if (userId.toString() !== req['x-api-key']) {
            return res.status(403).send({ status: false, message: 'Unauthorized' });
        }
        const cartByUser = await CartModel.findOne({ userId: userId })
        if (cartId || cartByUser) {
            if (cartId) {
                if (!isValidObjectId(cartId)) {
                    return res.status(400).send({ status: false, message: 'Invalid cartId' });
                }
                const cart = await CartModel.findOne({ _id: cartId });
                if (!cart) {
                    return res.status(404).send({ status: false, message: 'Cart not found' });
                }
                if (String(cart.userId) !== userId) {
                    return res.status(403).send({ status: false, message: 'Unauthorized' });
                }
                if (cart.items.length > 0) {
                    let checkPro = (cart.items).find(x => x.productId.toString() === productId);
                    if (!checkPro) {
                        cart.items.push({
                            productId: productId,
                            quantity: 1
                        })
                        cart.totalItems += 1;
                        cart.totalPrice += product.price;
                        const val = await cart.save();
                        return res.status(200).send({ status: true, message: "Product updated", data: val });
                    }
                    else {
                        checkPro.quantity += 1;
                        cart.totalPrice += product.price;
                        const val = await cart.save();
                        return res.status(200).send({ status: true, message: "Product updated", data: val });
                    }
                }
                else {
                    cart.items.push({
                        productId: productId,
                        quantity: 1
                    })
                    cart.totalItems = 1;
                    cart.totalPrice = product.price;
                    const val = await cart.save();
                    return res.status(200).send({ status: true, message: "Product updated", data: val });
                }
            }
            else {

                if (cartByUser.items.length > 0) {

                    let checkPro = (cartByUser.items).find(x => (x.productId).toString() === productId);
                    if (!checkPro) {
                        cartByUser.items.push({
                            productId: productId,
                            quantity: 1
                        })
                        cartByUser.totalItems += 1;
                        cartByUser.totalPrice += product.price;
                        const val = await cartByUser.save();
                        return res.status(200).send({ status: true, message: "Product updated", data: val });
                    }
                    else {
                        checkPro.quantity += 1;
                        cartByUser.totalPrice += product.price;
                        const val = await cartByUser.save();
                        return res.status(200).send({ status: true, message: "Product updated", data: val });
                    }
                }
                else {
                    cartByUser.items.push({
                        productId: productId,
                        quantity: 1
                    })
                    cartByUser.totalItems = 1;
                    cartByUser.totalPrice = product.price;
                    const val = await cartByUser.save();
                    return res.status(200).send({ status: true, message: "Product updated", data: val });
                }
            }
        }
        else {
            const cartDetail = {
                userId: userId,
                items: [{
                    productId: productId,
                    quantity: 1
                }],
                totalPrice: product.price,
                totalItems: 1
            }
            const cart = await CartModel.create(cartDetail);
            return res.status(201).send({ status: true, message: 'Cart created', data: cart });
        }
    } catch (error) {
          return  res.status(500).send({ status: false, message: error.message });
    }
}


const updateCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { cartId, productId, removeProduct } = req.body

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: 'Invalid userId' });
        }
        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: 'Invalid productId' });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found' });
        }
        const product = await ProductModel.findOne({ _id: productId, isDeleted: false });
        if (!product) {
            return res.status(404).send({ status: false, message: 'Product not found' });
        }
        if (userId !== req['x-api-key']) {
            return res.status(403).send({ status: false, message: 'Unauthorized' });
        }

        if (cartId) {
            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: 'Invalid cartId' });
            }
            const cart = await CartModel.findOne({ _id: cartId, isDeleted: false });
            if (!cart) {
                return res.status(404).send({ status: false, message: 'Cart not found' });
            }
            if (String(cart.userId) !== userId) {
                return res.status(403).send({ status: false, message: 'Unauthorized' });
            }
        }

        let cart = await CartModel.findOne({ userId: userId, });
            if(removeProduct !== 1 && removeProduct !==0){
                return res.status(400).send({status:false, message : "plz give valid remove product key"})
            }
        if (removeProduct === 1) {
            if (cart.items.length > 0) {
                let proCheck = (cart.items).find(x => (x.productId).toString() === productId);
                if (proCheck !== undefined) {
                    cart.items = (cart.items).filter(item => item.productId.toString() !== productId.toString())
                    cart.totalItems -= 1;
                    cart.totalPrice -= product.price;
                    const val = await cart.save();
                  
                    
                    return res.status(200).send({ status: true, message: "Product updated", data: val });
                }
                else {
                    return res.status(400).send({ status: false, message: "Product does not exist" });
                }
            }
            return res.status(200).send({ status: true, message: "Product updated", data: cart });
        }
        else if (removeProduct === 0) {
            if (cart.items.length > 0) {
               cart.items = [] 
            }
            cart.totalItems = 0;
            cart.totalPrice = 0;
            const val = await cart.save();
            return res.status(200).send({ status: true, message: "Product updated", data: val });
        }

    } catch (error) {
 
        return res.status(500).send({ status: false, message: error.message });
 
    }
}



const getCart = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: 'Invalid userId' });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found' });
        }
        if (userId !== req['x-api-key']) {
            return res.status(403).send({ status: false, message: 'Unauthorized' });
        }
        const cart = await CartModel.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).send({ status: false, message: 'Cart not found' });
        }
        return res.status(200).send({ status: true, message: 'Cart found', data: cart });
    } catch (error) {
       return res.status(500).send({ status: false, message: error.message });
    }
}


const cartDelete = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).send({ status: false, message: 'Please enter data' });
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: 'Invalid userId' });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found' });
        }
        if (userId !== req['x-api-key']) {
            return res.status(403).send({ status: false, message: 'Unauthorized' });
        }
        const cart = await CartModel.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).send({ status: false, message: 'Cart not found' });
        }
        cart.totalItems = 0;
        cart.totalPrice = 0;
        cart.items = [];
        let val = await cart.save();
        return res.status(204).send({
            status: true,
            message: 'Success',
            data: val
        })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}



module.exports = {
    createCart,
    updateCart,
    getCart,
    cartDelete
}