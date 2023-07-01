const { default: mongoose } = require("mongoose");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { isValid } = require("../validation/validator");
const { isValidObjectId } = mongoose;

const keys = ["fname", "lname", "email", "profileImage", "phone", "password"];

const create = async (req, res) => {
  try {
    const userData = req.body;

    const valid = "to be made"; //TODO
    // TODO S3 image

    const { fname, lname, email, profileImage, phone, password, address } =
      userData;

    for (let i = 0; i < keys.length; i++) {
      if (!isValid(userData[keys[i]])) {
        return res
          .status(400)
          .send({ status: false, message: "missing mandatory fields" });
      }
    }

    if (
      !isValid(fname) ||
      !isValid(lname) ||
      !isValid(email) ||
      !isValid(phone) ||
      !isValid(password) ||
      !isValid(address.shipping) ||
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
    // unique validation

    const alreadyUser = await UserModel.find({ $or: [{ email }, { phone }] });
    if (alreadyUser.length > 0)
      return res
        .status(400)
        .send({ status: false, message: "user already exists" });

    //valid password

    if (password.length >= 15 || password.length <= 8) {
      return res
        .status(400)
        .send({ status: false, message: "please input a valid password" });
    }
    const updatedPass = await bcrypt.hash(password, 10);

    userData.password = updatedPass;

    const userDocument = await UserModel.create(userData);

    return res.status(201).send({ status: true, message: "user created" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: false, message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email, password });

  if (!user) {
    return res.status(401).send({ status: false, message: "unauthenticated" });
  }

  const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expireIn: "1d" });
  return res.status(200).send({
    status: true,
    message: "User Login Successfully",
    data: { userId: user._id, ...token },
  });
};

const getProfile = async (req, res) => {
  // valid object id check i have to do

  const id = req.params.userId;
  if (!isValidObjectId(id))
    return res.status(404).send({ status: false, message: "user Not found" });
  if (id !== req["x-api-key"])
    return res.status(403).send({ status: false, message: "unauthorized" });
  // doubt over this i think it is not required
  const user = await UserModel.findById(id);
  if (!user) {
    return res.status(404).send({ statu: false, message: "user not found" });
  }
  return res
    .status(200)
    .send({ status: true, message: "user profiles details", data: user });
};

const updateUser = async (req, res) => {
  const id = req.params.userId;
  if (!isValidObjectId(id))
    return res.status(404).send({ status: false, message: "user Not found" });
  if (id !== req["x-api-key"])
    return res.status(403).send({ status: false, message: "unauthorized" });

  //  validation check

  const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  return res.status(200).send({
    status: true,
    message: "updated user successfully",
    data: updatedUser,
  });
};

module.exports = {
  create,
  login,
  getProfile,
  updatedUser,
};
