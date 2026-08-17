const mongoose = require("mongoose");
const userModel = require("../models/user.model");
const blackListTokenModel = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");
const captainModel = require("../models/captain.models");

const getTokenFromRequest = (req) => {
  // Check for token in cookies
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  // Check for token in Authorization header
  const authHeader = req.headers.authorization || "";

  console.log("AUTH HEADER:", authHeader);

  // Split the header into scheme and token
  const [scheme, token] = authHeader.split(" ");
  // Validate the scheme and token
  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
};

// Middleware to authenticate user based on JWT token
module.exports.authUser = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  console.log("AUTH TOKEN:", token ? `${token.slice(0, 20)}...` : "No token");

  if (!token) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
    });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const blacklistedToken = await blackListTokenModel.findOne({ token });
      if (blacklistedToken) {
        return res.status(401).json({
          message: "Token is blacklisted. Please log in again.",
        });
      }
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid token.",
    });
  }
};

module.exports.authMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  return next();
};


module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  try {
    // Check if token is blacklisted
    if (mongoose.connection.readyState === 1) {
      const isBlacklisted = await blackListTokenModel.findOne({ token });
      if (isBlacklisted) {
        return res.status(401).json({
          message: "Token is blacklisted. Please log in again.",
        });
      }
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find captain by ID
    const captain = await captainModel.findById(decoded._id);

    if (!captain) {
      return res.status(401).json({
        message: "Captain not found.",
      });
    }

    req.captain = captain;

    return next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid token.",
    });
  }
};
