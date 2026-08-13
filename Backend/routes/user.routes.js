const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middlewares");

router.post(
  "/register",
  [
    body("fullname.firstname")
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters long"),

    body("fullname.lastname")
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters long"),

    body("email").isEmail().withMessage("Invalid email address"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.registerUser,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email address"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.loginUser,
);

router.get(
  "/profile",
  authMiddleware.authUser,
  authMiddleware.authMiddleware,
  userController.getUserProfile,
);
router.get("/logout", authMiddleware.authUser, userController.logoutUser);

module.exports = router;
