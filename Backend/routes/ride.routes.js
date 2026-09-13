const express = require("express");
const ridecontroller = require("../controllers/ride.controller");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middlewares");

const router = express.Router();

router.post(
  "/create",
  authMiddleware.authUser,
  body("pickup")
    .isString()
    .notEmpty()
    .withMessage("Pickup location is required"),
  body("destination")
    .isString()
    .notEmpty()
    .withMessage("Destination location is required"),
  body("vehicleType")
    .isString()
    .isIn(["auto", "car", "moto"])
    .withMessage("Invalid vehicle type"),
  ridecontroller.createride,
);

module.exports = router;
