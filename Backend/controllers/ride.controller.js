const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../models/ride.models");

module.exports.createride = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    // const pickupCoordinates = await mapService.getAddressCoordinates(pickup);
    // console.log("Pickup Coordinates:", pickupCoordinates);

    // const captainsNearby = await mapService.getCaptainsNearby(
    //   pickupCoordinates.latitude,
    //   pickupCoordinates.longitude,
    //   5,
    // ); // 5 km radius
    // console.log("Captains Nearby:", captainsNearby);

    try {
      const pickupCoordinates = await mapService.getAddressCoordinates(pickup);
      const captainsNearby = await mapService.getCaptainsNearby(
        pickupCoordinates.latitude,
        pickupCoordinates.longitude,
        5,
      );

      const rideWithUser = await rideModel
        .findById(ride._id)
        .populate("user")
        .lean();
      delete rideWithUser.otp;

      captainsNearby.forEach((captain) => {
        if (captain.socketId) {
          console.log("User created ride sent to captain:", rideWithUser);
          sendMessageToSocketId(captain.socketId, {
            event: "newRide",
            data: rideWithUser,
          });
        }
      });
    } catch (mapErr) {
      console.warn(
        "Map coordinates / captain lookup fallback:",
        mapErr.message,
      );
    }

    return res.status(201).json(ride);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.body;

  try {
    const ride = await rideService.startRide({
      rideId,
      otp: String(otp),
      captainId: req.captain._id,
    });

    if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "rideStarted",
        data: ride,
      });
    }

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports.getFare = async (req, res) => {
  const { pickup, destination } = req.query;

  if (!pickup || !destination) {
    return res
      .status(400)
      .json({ message: "Pickup and destination are required" });
  }

  try {
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json(fare);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain,
    });

    if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "rideConfirmed",
        data: ride,
      });
    }

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({
      rideId,
      captainId: req.captain._id,
    });

    if (ride.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "rideEnded",
        data: ride,
      });
    }

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
