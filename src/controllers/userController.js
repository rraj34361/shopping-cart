const { default: mongoose } = require("mongoose");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { isValid, unique } = require("../validation/validator");
const { uploadFile } = require("../aws/S3");
const { isValidObjectId } = mongoose;
const jwt = require('jsonwebtoken')
require('dotenv').config()
const {SECRET_KEY} = process.env
const {isEmail} = require('validator')

const keys = ["fname", "lname", "email", "phone", "password"];

const create = async (req, res) => {
  try {
    const userData = req.body;

    let { fname, lname, email,  phone, password, address } =
      userData;
      // console.log(fname)
      let file = req.files
      console.log(file)
    // console.log(profileImage)
    for (let i = 0; i < keys.length; i++) {
      if (!isValid(userData[keys[i]])) {
        return res
          .status(400)
          .send({ status: false, message: ` ${keys[i]} missing` });
      }
    }
 

    if (
      !isValid(address.shipping.street) ||
      !isValid(address.shipping.city) ||
      !isValid(address.shipping.pincode) ||
      !isValid(address.billing.street) ||
      !isValid(address.billing.city) ||
      !isValid(address.billing.pincode)
    ) {
      return res
        .status(400)
        .send({ status: false, message: "missing mandatory fields" });
    }


    if (file.length === 0) {
      return res.status(400).send({ status: false, message: 'Please upload profile image' });
  }


       // valid email
       if(!isEmail(email)){
        return  res.status(400).send({status:false, message: 'Please enter valid email'})
    }
        
      //valid indian mobile number
      if(!(/^[6789]\d{9}$/.test(phone))){
        return res
        .status(400)
        .send({ status: false, message: "invalid number" });
      }

    // unique validation

    const alreadyUser = await UserModel.find({ $or: [{ email }, { phone }] });
    if (alreadyUser.length > 0)
      return res
        .status(400)
        .send({ status: false, message: "user already exists" });

    // const user = unique(UserModel, {email}, {phone});
    // if (!user)
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "user already exists" });

    //valid password

    if (password.length >= 15 || password.length <= 8) {
      return res
        .status(400)
        .send({ status: false, message: "please input a valid password" });
    }
    const salt = await bcrypt.genSalt();
    const updatedPass = await bcrypt.hash(password, salt);

    userData.password = updatedPass;
      req.body.profileImage = await uploadFile(file[0])
    const userDocument = await UserModel.create(userData);

    return  res.status(201).send({ status: true, message: "user created", data : userDocument });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//=============================================//

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

  if (!isValid(email) || !isValid(password)) {
    return res.status(400).send({ status: false, message: 'Please enter email and password' });
}

  const user = await UserModel.findOne({ email});


  if (!user) {
    return  res.status(401).send({ status: false, message: "unauthenticated" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
         return res.status(401).send({ status: false, message: 'Invalid password' });
        }

  const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "24h" });
  res.setHeader('x-api-key', token);
  return  res.status(200).send({
    status: true,
    message: "User Login Successfully",
    data: { userId: user._id, token },
  })
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
 try {
   // valid object id check 
   const id = req.params.userId;
   if (!isValidObjectId(id))
     return  res.status(400).send({ status: false, message: "user Not found" });
   if (id.toString() !== req["x-api-key"])
     return  res.status(403).send({ status: false, message: "unauthorized" });
   // doubt over this i think it is not required
   const user = await UserModel.findById(id);
   if (!user) {
     return  res.status(404).send({ statu: false, message: "user not found" });
   }
   return res
     .status(200)
     .send({ status: true, message: "user profiles details", data: user })
 } catch (error) {
  return res.status(500).send({ status: false, message: error.message });
 }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.userId;
    let data = req.body;
    //validate objectId
  if (!isValidObjectId(id))
    return  res.status(400).send({ status: false, message: "invalid userId" });
    if ((Object.keys(data)).length === 0 && !req.files) {
        return  res.status(400).send({ status: false, message: 'Please enter data' });
    }
  if (id.toString() !== req["x-api-key"])
    return  res.status(403).send({ status: false, message: "unauthorized" });
     
    const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).send({ status: false, message: 'User not found' });
        }
        if (data.email) {
          if (!isEmail(data.email)) {
            return res.status(400).send({ status: false, message: 'Please enter valid email' })
        }
          const emailCheck = await UserModel.findOne({ email: data.email });
          if (emailCheck) {
              return res.status(400).send({ status: false, message: 'Email already exists' });
          }
          
      }
      if (data.phone) {
        const phoneCheck = await UserModel.findOne({ phone: data.phone });
        if(!(/^[6789]\d{9}$/.test(data.phone))){
          return res
          .status(400)
          .send({ status: false, message: "invalid number" });
        }
        if (phoneCheck) {
            return res.status(400).send({ status: false, message: 'Phone number already exists' });
        }
    }
     if(data.password){
         if (data.password.length >= 15 || data.password.length <= 8) {
      return res
        .status(400)
        .send({ status: false, message: "please input a valid password" });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);
    data.password = hashedPassword
  }
  //  validation check
  //  const values = Object.keys(req.body)
  //  for(let key of values){
  //   if(!isValid(req.body[key])){
  //     return  res.status(400).send({status : false, message : `invalid ${key}`})
  //   }
  //  }

  const updatedProfile = await UserModel.findByIdAndUpdate(id, {$set : data}, {
    new: true,
  });

  return  res.status(200).send({
    status: true,
    message: "User updated successfully",
    data: updatedProfile,
  });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  create,
  login,
  getProfile,
  updateUser,
};
