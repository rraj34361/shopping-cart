const express = require("express");
const {
  create,
  login,
  getProfile,
  updateUser,
} = require("../controllers/userController");

const {auth} = require('../middleware/auth')
const {
  createProduct, getProduct, getProductById, updateProduct, deletedProduct
} = require('../controllers/productController')

const { createCart, getCart, updateCart, cartDelete } = require('../controllers/cartController');
const { createOrder, updateOrder } = require('../controllers/orderController');



const router = express.Router();
//=================user=================//
router.post("/register",create);
router.post("/login",login);
router.get("/user/:userId/profile",getProfile);
router.put("/user/:userId/profile",updateUser);
 

//=================product===================//

router.post('/products', createProduct)
router.get('/products', getProduct)
router.get('/products/:productId',getProductById)
router.put('/products/:productId', updateProduct)
router.delete('/products/:productId', deletedProduct)


// ========================================= Cart routes ======================================================
router.post('/users/:userId/cart', auth, createCart)
router.get('/users/:userId/cart', auth, getCart)
router.put('/users/:userId/cart', auth, updateCart)
router.delete('/users/:userId/cart', auth, cartDelete)

// ========================================== Order routes ======================================================
router.post('/users/:userId/orders', auth, createOrder)
router.put('/users/:userId/orders', auth, updateOrder)

module.exports = router;
