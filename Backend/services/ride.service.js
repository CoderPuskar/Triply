const rideModel = require("../models/ride.models");
const mapsService = require("./maps.service");
const crypto = require("crypto");

function getOtp(num) {
  if (!Number.isInteger(num) || num < 1 || num > 15) {
    throw new Error("OTP length must be an integer between 1 and 15");
  }

  const minimum = 10 ** (num - 1);
  const maximum = 10 ** num;
  return crypto.randomInt(minimum, maximum).toString();
}

async function getFare(pickup, destination, vehicleType) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const allowedVehicleTypes = ["auto", "car", "moto"];

  if (vehicleType && !allowedVehicleTypes.includes(vehicleType)) {
    throw new Error("Invalid vehicle type");
  }

  const distanceTime = await mapsService.getDistanceAndTime(
    pickup,
    destination,
  );

  const distance = Number.parseFloat(distanceTime.distance);
  const estimatedDuration = Number.parseFloat(distanceTime.time);
  const duration = Math.ceil(estimatedDuration * 1.2); //this is to account for traffic and other delays, we are adding 20% to the estimated duration

  if (Number.isNaN(distance) || Number.isNaN(duration)) {
    throw new Error("Unable to calculate ride distance and duration");
  }

  const baseFare = {
    auto: 30,
    car: 50,
    moto: 15,
  };

  const perKmRate = {
    auto: 10,
    car: 20,
    moto: 5,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    moto: 1.5,
  };

  const fare = {
    auto: Math.round(
      baseFare.auto + distance * perKmRate.auto + duration * perMinuteRate.auto,
    ),

    car: Math.round(
      baseFare.car + distance * perKmRate.car + duration * perMinuteRate.car,
    ),

    moto: Math.round(
      baseFare.moto + distance * perKmRate.moto + duration * perMinuteRate.moto,
    ),
  };

  if (vehicleType) {
    return {
      fare: fare[vehicleType],
      distance,
      duration,
    };
  }

  return { fare, distance, duration };
}

module.exports.getFare = getFare;

module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  if (!["auto", "car", "moto"].includes(vehicleType)) {
    throw new Error("Invalid vehicle type");
  }

  const { fare, distance, duration } = await getFare(
    pickup,
    destination,
    vehicleType,
  );
  const otp = getOtp(6);

  const ride = await rideModel.create({
    user,
    pickup,
    destination,
    fare,
    distance,
    duration,
    otp,
  });

  return ride;
};
