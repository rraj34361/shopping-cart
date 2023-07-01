const { default: mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const CartSchema = new mongoose.Schema(
  {
    userId: { ObjectId, ref: "user", required: true, unique: true },
    items: [
      {
        productId: { ObjectId, ref: "product", required: true },
        quantity: { Number, required: true, min: 1 },
      },
    ],
    totalPrice: {
      Number,
      required: true,
      comment: "Holds total price of all the items in the cart",
    },
    totalItems: {
      Number,
      required: true,
      comment: "Holds total number of items in the cart",
    },
  },
  { timestamps }
);

module.exports = mongoose.model("cart", CartSchema);
