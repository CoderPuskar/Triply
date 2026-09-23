const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [2, "Last name must be at least 2 characters long"],
    },
  },
  // age: {
  //   type: Number,
  //   required: true,
  // },
  // experience: {
  //   type: Number,
  //   required: true,
  // },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, "Vehicle color must be at least 3 characters long"],
    },
    numberplate: {
      type: String,
      required: true,
      minlength: [4, "Vehicle number plate must be at least 4 characters long"],
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "Vehicle capacity must be at least 1"],
    },
    vehicalType: {
      type: String,
      required: true,
      enum: ["car", "bike", "van", "auto", "moto"],
    },
  },
  location: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },

  geoLocation: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
    },
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"],
    select: false, // Exclude password from query results by default
  },
  socketId: {
    type: String,
  },
  onlineSince: {
    type: Date,
    default: null,
  },
  onlineStatsDate: {
    type: String,
    default: "",
  },
  onlineSecondsToday: {
    type: Number,
    default: 0,
  },
});


captainSchema.index({ geoLocation: "2dsphere" });

captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

captainSchema.statics.hashPasswrd = async function (password) {
  return await bcrypt.hash(password, 10);
};

const CaptainModel = mongoose.model("Captain", captainSchema);
module.exports = CaptainModel;
