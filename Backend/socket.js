let io;
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.models");
const rideModel = require("./models/ride.models");

const initializeSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    socket.on("join", async (data) => {
      try {
        const { userId, userType } = data || {};

        if (!userId || !["user", "captain"].includes(userType)) {
          return;
        }
        console.log(
          `User ${userId} of type ${userType} is trying to join with socket ID: ${socket.id}`,
        );
        if (userType === "user") {
          await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "captain") {
          await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
        }

        console.log(
          `User ${userId} of type ${userType} joined with socket ID: ${socket.id}`,
        );
      } catch (error) {
        console.error("Socket join error:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });

    socket.on("update_location_captain", async (data) => {
      const { userId, location } = data || {};
      if (
        !userId ||
        !location ||
        typeof location.latitude !== "number" ||
        typeof location.longitude !== "number"
      ) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      try {
        await captainModel.findByIdAndUpdate(userId, {
          socketId: socket.id,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          geoLocation: {
            type: "Point",
            coordinates: [location.longitude, location.latitude],
          },
        });
        console.log(`Updated location for captain ${userId}:`, location);

        // forward live location to the user on this captain's active ride
        const activeRide = await rideModel
          .findOne({
            captain: userId,
            status: { $in: ["accepted", "ongoing"] },
          })
          .populate("user", "socketId");

        if (activeRide?.user?.socketId) {
          sendMessageToSocketId(activeRide.user.socketId, {
            event: "captain_live_location",
            data: {
              rideId: String(activeRide._id),
              location: { latitude: location.latitude, longitude: location.longitude },
            },
          });
        }
      } catch (err) {
        console.error("Error updating captain location:", err.message);
        socket.emit("error", { message: "Failed to update location" });
      }
    });

    socket.on("update_location_user", async (data) => {
      const { userId, location } = data || {};
      if (
        !userId ||
        !location ||
        typeof location.latitude !== "number" ||
        typeof location.longitude !== "number"
      ) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      try {
        // Keep the saved socket current after a browser/socket reconnection.
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });

        const activeRide = await rideModel
          .findOne({
            user: userId,
            status: { $in: ["accepted", "ongoing"] },
          })
          .populate("captain", "socketId");

        if (activeRide?.captain?.socketId) {
          sendMessageToSocketId(activeRide.captain.socketId, {
            event: "user_live_location",
            data: {
              rideId: String(activeRide._id),
              location: {
                latitude: location.latitude,
                longitude: location.longitude,
              },
            },
          });
        }
      } catch (err) {
        console.error("Error forwarding user location:", err.message);
      }
    });
  });

  return io;
};

const sendMessageToSocketId = (socketId, messageObject) => {
  console.log(
    "Sending message to socket ID:",
    socketId,
    "Message:",
    messageObject,
  );
  if (!io) {
    console.warn("Socket not initialized yet");
    return;
  }

  io.to(socketId).emit(messageObject.event, messageObject.data);
};

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
};
