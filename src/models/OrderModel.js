const { default: mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const OrderSchema = new mongoose.Schema(
    {
        userId: {ObjectId, ref : "user", required : true},
        items: [{
          productId: {ObjectId, ref : "product", required : true},
          quantity: {Number, mandatory, min: 1}
        }],
        totalPrice: {Number, required : true, comment: "Holds total price of all the items in the cart"},
        totalItems: {Number, required : true, comment: "Holds total number of items in the cart"},
        totalQuantity: {Number, required : true, comment: "Holds total number of quantity in the cart"},
        cancellable: {Boolean, default: true},
        status: {string, default: 'pending', enum : [pending, completed, cancled]},
        deletedAt: {Date}, 
        isDeleted: {Boolean, default: false},
        
      },
  { timestamps }
);

module.exports = mongoose.model("order", OrderSchema);
