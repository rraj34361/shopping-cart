const { default: mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const OrderSchema = new mongoose.Schema(
    {
        userId: {type : ObjectId, ref : "user", required : true},
        items: [{
          productId: {type : ObjectId, ref : "product", required : true},
          quantity: {type  :  Number, mandatory, min: 1}
        }],
        totalPrice: {type  :  Number, required : true, comment: "Holds total price of all the items in the cart"},
        totalItems: {type  :  Number, required : true, comment: "Holds total type  :  Number of items in the cart"},
        totalQuantity: {type  :  Number, required : true, comment: "Holds total type  :  Number of quantity in the cart"},
        cancellable: {type : Boolean, default: true},
        status: {type : String, default: 'pending', enum : [pending, completed, cancled]},
        deletedAt: {type : Date}, 
        isDeleted: {type : Boolean, default: false},
        
      },
  { timestamps : true }
);

module.exports = mongoose.model("order", OrderSchema);
