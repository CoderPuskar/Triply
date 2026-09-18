let io;
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.models");

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

        if (!userId || !userType) {
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
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });
      } catch (err) {
        console.error("Error updating captain location:", err.message);
        socket.emit("error", { message: "Failed to update location" });
      }
    });
  });

  return io;
};

const sendMessageToSocketId = (socketId, eventName, data) => {
  if (!io) {
    console.warn("Socket not initialized yet");
    return;
  }

  io.to(socketId).emit(eventName, data);
};

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
};
