const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const captainModel = require("../models/captain.models");
const blackListTokenModel = require("../models/blacklistToken.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log("Request register Body for captain:", req.body);

  const { fullname, email, password, vehicle, age, experience, location } =
    req.body;

  const isCaptainAlreadyExist = await captainModel.findOne({ email });

  if (isCaptainAlreadyExist) {
    return res.status(400).json({ message: "Captain already exist" });
  }

  try {
    const captain = await captainService.registerCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password,
      color: vehicle.color,
      numberplate: vehicle.numberplate,
      capacity: vehicle.capacity,
      vehicalType: vehicle.vehicalType,
    });
    const token = captain.generateAuthToken();
    res.status(201).json({ token, captain });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  console.log("login body post :",req.body)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find captain by email and include password field
    const captain = await captainModel.findOne({ email }).select("+password");

    if (!captain) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, captain.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = captain.generateAuthToken();

    // Set token in cookie
    res.cookie("token", token);

    // Remove password from response
    captain.password = undefined;

    res.status(200).json({ token, captain });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getCaptainProfile = async (req, res, next) => {
  console.log("Captain profile get request:", req.body);
  res.status(200).json({ captain: req.captain });
};

module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  let decodedCaptain = null;
  console.log("logout get request :", req.body);

  if (token) {
    decodedCaptain = jwt.decode(token);
  }

  console.log("Captain logging out:", decodedCaptain);
  res.clearCookie("token");

  if (token) {
    await blackListTokenModel.create({ token });
  }

  console.log("Token blacklisted:", token);
  res.status(200).json({ message: "Logged out successfully" });
};
