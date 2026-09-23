const express = require("express");
const ridecontroller = require("../controllers/ride.controller");
const { body, query } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middlewares");

const router = express.Router();

// this is the route for creating a ride request. It requires authentication and validates the request body for pickup, destination, and vehicleType.
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

router.post(
  "/start",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Valid ride ID is required"),
  body("otp")
    .isInt({ min: 100000, max: 999999 })
    .withMessage("A six-digit OTP is required"),
  ridecontroller.startRide,
);

// this is the route for getting the fare for a ride. It requires authentication and validates the query parameters for pickup, destination, and vehicleType.
router.get(
  "/fare",
  authMiddleware.authUser,
  query("pickup")
    .isString()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Pickup location is required"),
  query("destination")
    .isString()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Destination location is required"),
  query("vehicleType")
    .optional()
    .isString()
    .isIn(["auto", "car", "moto"])
    .withMessage("Invalid vehicle type"),
  ridecontroller.getFare,
);

router.post(
  "/confirm",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Valid ride ID is required"),
  ridecontroller.confirmRide,
);

router.post("/endRide", authMiddleware.authCaptain, 
  body("rideId").isMongoId().withMessage("Valid ride ID is required"),
  ridecontroller.endRide);

module.exports = router;
