const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fname: { type:String, required: true },
    lname: { type:String, required: true },
    email: { type:String, required: true, lowercase : true, unique: true }, //valid email
    profileImage: { type:String, required: true },
    phone: { type:String, required: true, unique: true }, //valid indian type:Number
    password: { type:String, required: true, min: 8, max: 15 },
    address: {
      shipping: {
        street: { type:String, required: true },
        city: { type:String, required: true },
        pincode: { type:Number, required: true },
      },
      billing: {
        street: { type:String, required: true },
        city: { type:String, required: true },
        pincode: { type:Number, required: true },
      },
    },
  },
  { timestamps : true }
);

module.exports = mongoose.model("user", UserSchema);
