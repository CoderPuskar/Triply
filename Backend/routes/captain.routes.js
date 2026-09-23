const captainController = require("../controllers/captain.controller");
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middlewares");

// POST /register - register a new captain (validation + simple response)
router.post(
  "/register",
  [
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("Name is required"),
    body("email")
      .isEmail()
      .withMessage("Valid email is required")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("vehicle.color")
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters long"),
    body("vehicle.numberplate")
      .isLength({ min: 4 })
      .withMessage("Plate must be at least 4 characters long"),
    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1"),
    body("vehicle.vehicalType")
      .isIn(["car", "bike", "van", "auto"])
      .withMessage("Invalid vehicle type"),
  ],
  captainController.registerCaptain,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  captainController.loginCaptain,
);

router.get(
  "/daily-stats",
  authMiddleware.authCaptain,
  captainController.getDailyStats,
);

router.get(
  "/profile",
  authMiddleware.authCaptain,
  captainController.getCaptainProfile,
);

router.get(
  "/logout",
  authMiddleware.authCaptain,
  captainController.logoutCaptain,
);

module.exports = router;
