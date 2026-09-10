const mapsService = require("../services/maps.service");
const { validationResult } = require("express-validator");

// Get coordinates for a given address
module.exports.getCoordinates = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { address } = req.query;

    const coordinates = await mapsService.getAddressCoordinates(address);

    res.status(200).json(coordinates);
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);

    const statusCode = error.message === "Location not found" ? 404 : 500;

    res.status(statusCode).json({
      error: error.message,
    });
  }
};

// Get road distance and estimated travel time
module.exports.getDistanceAndTime = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { origin, destination } = req.query;

    const result = await mapsService.getDistanceAndTime(origin, destination);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating distance and time:", error.message);

    const statusCode =
      error.message === "Location not found" ||
      error.message === "Route not found"
        ? 404
        : 500;

    res.status(statusCode).json({
      error: error.message,
    });
  }
};

// Get auto-complete suggestions for an address input
module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { input } = req.query;

    const suggestions = await mapsService.getAutoCompleteSuggestions(input);

    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error.message);

    res.status(500).json({
      error: error.message,
    });
  }
};
