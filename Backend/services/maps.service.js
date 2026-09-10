const axios = require("axios");

const getAddressCoordinates = async (address) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: address,
          format: "json",
          limit: 1,
        },
        headers: {
          "Accept-Language": "en",
          "User-Agent": "Triply/1.0",
        },
      },
    );

    if (response.data.length === 0) {
      throw new Error("Location not found");
    }

    const location = response.data[0];

    return {
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon),
    };
  } catch (error) {
    console.error("Geocoding error:", error.message);
    throw error;
  }
};

// const getAutoCompleteSuggestions = async (input) => {
//   try {
//     const response = await axios.get(NOMINATIM_URL, {
//       params: {
//         q: input,
//         format: "json",
//         limit: 5,
//         addressdetails: 1,
//       },
//       headers: NOMINATIM_HEADERS,
//     });

//     return response.data.map((location) => ({
//       displayName: location.display_name,
//       latitude: parseFloat(location.lat),
//       longitude: parseFloat(location.lon),
//     }));
//   } catch (error) {
//     console.error("Autocomplete error:", error.message);
//     throw error;
//   }
// };

// Get road distance and estimated travel time

const getDistanceAndTime = async (origin, destination) => {
  try {
    const originCoordinates =
      await module.exports.getAddressCoordinates(origin);

    const destinationCoordinates =
      await module.exports.getAddressCoordinates(destination);

    const response = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/` +
        `${originCoordinates.longitude},${originCoordinates.latitude};` +
        `${destinationCoordinates.longitude},${destinationCoordinates.latitude}` +
        `?overview=false`,
    );

    if (!response.data.routes || response.data.routes.length === 0) {
      throw new Error("Route not found");
    }

    const route = response.data.routes[0];

    const distanceKm = route.distance / 1000;

    const timeMinutes = Math.round(route.duration / 60);

    return {
      distance: `${distanceKm.toFixed(2)} km`,
      time: `${timeMinutes} minutes`,
    };
  } catch (error) {
    console.error("Error calculating road distance and time:", error.message);

    throw error;
  }
};

module.exports = {
  getAddressCoordinates,
  getDistanceAndTime,
//   getAutoCompleteSuggestions,
};

// it will take an address and return the coordinates of that address using open street map api
