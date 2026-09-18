const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");
const {sendMessageToSocketId} = require("../socket");

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

const pickupCoordinates = await mapService.getAddressCoordinates(pickup);
console.log("Pickup Coordinates:", pickupCoordinates);
const captainsNearby = await mapService.getCaptainsNearby(pickupCoordinates.latitude, pickupCoordinates.longitude , 5); // 5 km radius
console.log("Captains Nearby:", captainsNearby);

const rideForCaptains = ride.toObject();
delete rideForCaptains.otp;// Remove OTP before sending to captains

captainsNearby.map(captain=>{

  sendMessageToSocketId(captain.socketId,
    { event: "newRide",
     data: rideForCaptains })
})


    return res.status(201).json(ride);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports.startRide = async (req, res) => {
  const { rideId, otp } = req.body;

  if (!rideId || !/^\d{6}$/.test(String(otp))) {
    return res.status(400).json({ message: "Ride ID and a six-digit OTP are required" });
  }

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
