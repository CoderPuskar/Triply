const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log("Request body:", req.body); // Log the request body for debugging

    const { fullname, email, password } = req.body;
    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
    });
    const token = user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password"); //when i use find one then password is not selected by default, because in the user model we have set select:false for password field ,so we need to use select("+password") to get the password field from the database.

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password); //this comparepassword method is defined in the user model, it compares the password entered by the user with the hashed password stored in the database.

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();
  res.cookie("token", token); // Set the token in a cookie
  res.status(200).json({ user, token });
};
module.exports.getUserProfile = async (req, res, next) => {
  return res.status(200).json({ user: req.user });
};

module.exports.logoutUser = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  let decodedUser = null;
  if (token) {
    decodedUser = jwt.decode(token);
  }

  console.log("User logging out:", decodedUser);
  res.clearCookie("token");
  if (token) await blackListTokenModel.create({ token });
  console.log("Token blacklisted:", token);

  res.status(200).json({ message: "Logged out successfully" });
};
