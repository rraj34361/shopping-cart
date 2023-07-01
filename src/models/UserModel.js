const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fname: { String, required: true },
    lname: { String, required: true },
    email: { String, required: true, unique: true }, //valid email
    profileImage: { String, required: true },
    phone: { String, required: true, unique: true }, //valid indian number
    password: { String, required: true, minLen: 8, maxLen: 15 },
    address: {
      shipping: {
        street: { String, required: true },
        city: { String, required: true },
        pincode: { Number, required: true },
      },
      billing: {
        street: { String, required: true },
        city: { String, required: true },
        pincode: { Number, required: true },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
