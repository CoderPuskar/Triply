const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middlewares");
const mapController = require("../controllers/map.controller");
const { query } = require("express-validator");

router.get(
  "/get-coordinates",
  query("address").isString().trim().isLength({ min: 3 }).notEmpty(),
  authMiddleware.authUser,
  mapController.getCoordinates,
);

router.get(
  "/reverse-geocode",
  query("latitude").isFloat({ min: -90, max: 90 }),
  query("longitude").isFloat({ min: -180, max: 180 }),
  authMiddleware.authUser,
  mapController.getAddressFromCoordinates,
);

router.get(
  "/get-distance-time",
  query("origin").isString().trim().isLength({ min: 3 }).notEmpty(),
  query("destination").isString().trim().isLength({ min: 3 }).notEmpty(),
  authMiddleware.authUser,
  mapController.getDistanceAndTime,
);

router.get(
  "/get-suggestions",
  query("input").isString().trim().isLength({ min: 3 }).notEmpty(),
  authMiddleware.authUser,
  mapController.getAutoCompleteSuggestions,
);

module.exports = router;
