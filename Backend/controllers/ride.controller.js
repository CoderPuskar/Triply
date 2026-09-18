const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");
const {sendMessageToSocketId} = require("../socket");

module.exports.createride = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

const pickupCoordinates = await mapService.getAddressCoordinates(pickup);
console.log("Pickup Coordinates:", pickupCoordinates);
const captainsNearby = await mapService.getCaptainsNearby(pickupCoordinates.latitude, pickupCoordinates.longitude , 5); // 5 km radius
console.log("Captains Nearby:", captainsNearby);
ride.otp=""



    return res.status(201).json(ride);
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
