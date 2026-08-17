const captainModel = require("../models/captain.models");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log("Request Body for captain:", req.body);

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
