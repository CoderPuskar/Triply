const captainModel = require("../models/captain.models");

module.exports.registerCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  color,
  numberplate,
  capacity,
  vehicalType,
}) => {
  if (
    !firstname ||
    !email ||
    !password ||
    !color ||
    !numberplate ||
    !capacity ||
    !vehicalType
  ) {
    throw new Error("All fields are required");
  }

  const hashedPassword = await captainModel.hashPasswrd(password);

  const captain = await captainModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password: hashedPassword,
    vehicle: {
      color,
      numberplate,
      capacity,
      vehicalType,
    },
  });

  return captain;
};
