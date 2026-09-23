const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const captainModel = require("../models/captain.models");
const blackListTokenModel = require("../models/blacklistToken.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const rideModel = require("../models/ride.models");
const { getIndiaDateKey, getIndiaDayRange } = require("../utils/day");
const { finishOnlineSession } = require("../services/captain-presence.service");

module.exports.registerCaptain = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password, vehicle } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const isCaptainAlreadyExist = await captainModel.exists({
      email: normalizedEmail,
    });

    if (isCaptainAlreadyExist) {
      return res.status(409).json({
        message: "A captain account with this email already exists.",
      });
    }

    const captain = await captainService.registerCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email: normalizedEmail,
      password,
      color: vehicle.color,
      numberplate: vehicle.numberplate,
      capacity: vehicle.capacity,
      vehicalType: vehicle.vehicalType,
    });
    const token = captain.generateAuthToken();
    return res.status(201).json({ token, captain });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A captain account with this email already exists.",
      });
    }
    console.error("Captain registration failed:", error);
    return res.status(500).json({
      message: "Unable to create your captain account right now. Please try again.",
    });
  }
};

module.exports.loginCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find captain by email and include password field
    const captain = await captainModel
      .findOne({ email: email.trim().toLowerCase() })
      .select("+password");

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
    console.error("Captain login failed:", error);
    return res.status(500).json({
      message: "Unable to log in right now. Please try again.",
    });
  }
};

module.exports.getCaptainProfile = async (req, res, next) => {
  console.log("Captain profile get request:", req.body);
  res.status(200).json({ captain: req.captain });
};

module.exports.getDailyStats = async (req, res) => {
  try {
    const now = new Date();
    const today = getIndiaDateKey(now);
    const { start, end } = getIndiaDayRange(now);
    const [totals] = await rideModel.aggregate([
      {
        $match: {
          captain: req.captain._id,
          status: "completed",
          completedAt: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: null,
          earnings: { $sum: "$fare" },
          distanceKm: { $sum: "$distance" },
          rides: { $sum: 1 },
        },
      },
    ]);

    const onlineSeconds =
      req.captain.onlineStatsDate === today
        ? req.captain.onlineSecondsToday || 0
        : 0;
    const sessionStart = req.captain.onlineSince
      ? Math.max(new Date(req.captain.onlineSince).getTime(), start.getTime())
      : null;
    const liveSeconds = sessionStart
      ? Math.max(0, Math.floor((now.getTime() - sessionStart) / 1000))
      : 0;

    return res.status(200).json({
      earnings: totals?.earnings || 0,
      distanceKm: totals?.distanceKm || 0,
      rides: totals?.rides || 0,
      onlineSeconds: onlineSeconds + liveSeconds,
      isOnline: Boolean(req.captain.onlineSince),
      date: today,
    });
  } catch (error) {
    console.error("Unable to load captain daily stats:", error);
    return res.status(500).json({ message: "Unable to load daily stats." });
  }
};

module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  let decodedCaptain = null;
  console.log("logout get request :", req.body);

  if (token) {
    decodedCaptain = jwt.decode(token);
  }

  await finishOnlineSession(req.captain);

  console.log("Captain logging out:", decodedCaptain);
  res.clearCookie("token");

  if (token) {
    await blackListTokenModel.create({ token });
  }

  console.log("Token blacklisted:", token);
  res.status(200).json({ message: "Logged out successfully" });
};
