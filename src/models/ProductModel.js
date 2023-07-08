const { default: mongoose } = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: { type  :  String, required: true, unique: true },
  description: { type  :  String, required: true },
  price: { Number, required: true }, // valid decimal
  currencyId: { type  :  String, required: true, INR },
  currencyFormat: { type  :  String, required: true }, // rupee symbol
  isFreeShipping: { Boolean, default: false },
  productImage: { type  :  String, required: true }, // s3 link
  style: { type  :  String },
  availableSizes: {
    type: [String],
    enum: ["S", "XS", "M", "X", "L", "XXL", "XL"],
  }, // atleast one of them
  installments: {type :  Number },
  deletedAt: { type: Date },
  isDeleted: { type : Boolean, default: false },
},{ timestamps : true }
);

module.exports = mongoose.model("product", ProductSchema);
