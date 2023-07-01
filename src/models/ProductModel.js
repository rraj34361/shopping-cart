const { default: mongoose } = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: { String, required: true, unique: true },
  description: { String, required: true },
  price: { Number, required: true }, // valid decimal
  currencyId: { String, required: true, INR },
  currencyFormat: { String, required: true }, // rupee symbol
  isFreeShipping: { Boolean, default: false },
  productImage: { String, required: true }, // s3 link
  style: { String },
  availableSizes: {
    type: [String],
    enum: ["S", "XS", "M", "X", "L", "XXL", "XL"],
  }, // atleast one of them
  installments: { Number },
  deletedAt: { type: Date },
  isDeleted: { Boolean, default: false },
  createdAt: { timestamp },
  updatedAt: { timestamp },
});

module.exports = mongoose.model("product", ProductSchema);
