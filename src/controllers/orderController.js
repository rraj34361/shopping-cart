const OrderModel = require('../models/OrderModel');
const userModel = require('../models/UserModel');
const { isValidObjectId } = require('mongoose')
const CartModel = require('../models/CartModel');

const createOrder = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { status, cancellable } = req.body;

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: 'Invalid userId' });
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found' });
        }
        if (userId !== req['x-api-key'] ) {
            return res.status(403).send({ status: false, message: 'Unauthorized' });
        }
        if (status) {
            const arr = ["pending", "completed", "cancled"];
            if (!arr.includes(status)) {
                return res.status(400).send({ status: false, message: 'Invalid status' });
            }
        }
        const cart = await CartModel.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).send({ status: false, message: 'Cart not found' });
        }
        const totalQuantity = (cart.items).reduce((sum, item) => sum + item.quantity, 0);
        const orderDetails = {
            userId: userId,
            items: cart.items,
            totalItems: cart.totalItems,
            totalPrice: cart.totalPrice,
            totalQuantity: totalQuantity,
            cancellable: (cancellable) ? cancellable : true,
            status: (status) ? status : 'pending',
        }

        const order = await OrderModel.create(orderDetails);
        return res.status(201).send({ status: true, message: 'Order created', data: order });

    } catch (error) {
            return res.status(500).send({ status: false, message: error.message });
    }
}

const updateOrder = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { orderId, status } = req.body;
      
        if (!isValidObjectId(orderId) || !isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: 'Invalid orderId' });
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found' });
        }
        if (userId !== req['x-api-key']) {
            return res.status(403).send({ status: false, message: 'Unauthorized' });
        }
        const order = await OrderModel.findOne({ _id: orderId, userId: userId, isDeleted: false });
        if (!order) {
            return res.status(404).send({ status: false, message: 'Order not found' });
        }
        if (!status) {
            return res.status(400).send({ status: false, message: 'Please enter data' });
        }
        if (order.status == "completed") {
            return res.status(400).send({ status: false, message: 'Order already completed' });
        }
        if (order.status == "cancled") {
            return res.status(400).send({ status: false, message: 'Order already cancled' });
        }
        if (order.status == "pending") {
            const updateOrder = await OrderModel.findOneAndUpdate({ _id: orderId, isDeleted: false }, { $set: { status: status } }, { new: true });
            return res.status(200).send({ status: true, message: 'Order updated', data: updateOrder });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
module.exports = {
    createOrder,
    updateOrder,
}