const rideModel = require("../models/ride.models");
const { sendMessageToSocketId } = require("../socket");
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

  let distance = 0;
  if (typeof distanceTime.distance === "number") {
    distance = distanceTime.distance;
  } else if (distanceTime.distance?.value !== undefined) {
    distance = distanceTime.distance.value / 1000;
  } else if (typeof distanceTime.distance?.text === "string") {
    distance = Number.parseFloat(distanceTime.distance.text);
  } else if (typeof distanceTime.distanceText === "string") {
    distance = Number.parseFloat(distanceTime.distanceText);
  } else if (typeof distanceTime.distance === "string") {
    distance = Number.parseFloat(distanceTime.distance);
  }

  let estimatedDuration = 0;
  if (typeof distanceTime.duration === "number") {
    estimatedDuration = distanceTime.duration;
  } else if (distanceTime.duration?.value !== undefined) {
    estimatedDuration = distanceTime.duration.value / 60;
  } else if (typeof distanceTime.duration?.text === "string") {
    estimatedDuration = Number.parseFloat(distanceTime.duration.text);
  } else if (typeof distanceTime.timeText === "string") {
    estimatedDuration = Number.parseFloat(distanceTime.timeText);
  } else if (typeof distanceTime.time === "number") {
    estimatedDuration = distanceTime.time;
  } else if (typeof distanceTime.time === "string") {
    estimatedDuration = Number.parseFloat(distanceTime.time);
  }

  const duration = Math.ceil(estimatedDuration * 1.2); //this is to account for traffic and other delays, we are adding 20% to the estimated duration

  if (
    Number.isNaN(distance) ||
    Number.isNaN(duration) ||
    distance <= 0 ||
    duration <= 0
  ) {
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

  if (typeof ride?.populate === "function") {
    await ride.populate("user", "fullname");
  }

  return ride;
};

module.exports.startRide = async ({ rideId, otp, captainId }) => {
  const ride = await rideModel.findById(rideId).select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride is not accepted yet");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }
await rideModel.findOneAndUpdate(
    { _id: rideId },
    { status: "ongoing", captain: captainId },
    { new: true }
  );
  sendMessageToSocketId(ride.user.socketId, {
    event: "rideStarted",
    data: ride,
  });

  await ride.populate([
    { path: "user", select: "socketId fullname" },
    { path: "captain", select: "fullname vehicle" },
  ]);
  ride.otp = undefined;
  return ride;
};

module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}
