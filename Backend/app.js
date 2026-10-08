const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");

const express = require("express");
const app = express();
const cors = require("cors");

const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapsRoutes = require("./routes/maps.routes");
const rideRoutes = require("./routes/ride.routes");

const connectToDB = require("./db/db");
connectToDB();
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/maps", mapsRoutes);
app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/rides", rideRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/ping", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Triply backend is alive"
    });
});


module.exports = app;
