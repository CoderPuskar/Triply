const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await userModel.exists({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        message: "A user account with this email already exists.",
      });
    }
    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email: normalizedEmail,
      password: hashedPassword,
    });
    const token = user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A user account with this email already exists.",
      });
    }
    console.error("User registration failed:", error);
    return res.status(500).json({
      message: "Unable to create your account right now. Please try again.",
    });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel
      .findOne({ email: email.trim().toLowerCase() })
      .select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();
    res.cookie("token", token);
    user.password = undefined;
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error("User login failed:", error);
    return res.status(500).json({
      message: "Unable to log in right now. Please try again.",
    });
  }
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
