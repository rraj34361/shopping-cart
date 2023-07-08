const express = require("express");
const {
  create,
  login,
  getProfile,
  updateUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register",create);
router.post("/login",login);
router.get("/user/:userId/profile",getProfile);
router.put("/user/:userId/profile",updateUser);
 

module.exports = router;
