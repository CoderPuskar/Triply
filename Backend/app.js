const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cors = require("cors");

const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");

const connectToDB = require("./db/db");
connectToDB();
app.use(cookieParser());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const mapsRoutes = require("./routes/maps.routes");
app.use("/maps", mapsRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/users", userRoutes);
app.use('/captains',captainRoutes)

module.exports = app;
