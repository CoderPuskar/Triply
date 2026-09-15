# Backend API Documentation

## Overview

Triply backend is the API layer for the ride-booking platform. It is built with Node.js, Express, MongoDB, and JWT-based authentication. The backend handles user and captain registration/login, protected routes, map services, and ride creation.

This README documents the current implementation in the backend folder, including the active route definitions, validation logic, authentication flow, models, services, controller responsibilities, and request/response patterns.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for auth
- bcrypt for password hashing
- express-validator for validation
- cookie-parser for cookies
- cors for cross-origin requests
- dotenv for environment variables
- axios for external API calls to OpenStreetMap and OSRM

---

## Project structure

```bash
Backend/
├── app.js
├── server.js
├── package.json
├── README.md
├── .env
├── controllers/
│   ├── captain.controller.js
│   ├── map.controller.js
│   ├── ride.controller.js
│   └── user.controller.js
├── db/
│   └── db.js
├── middlewares/
│   └── auth.middlewares.js
├── models/
│   ├── blacklistToken.model.js
│   ├── captain.models.js
│   ├── ride.models.js
│   └── user.model.js
├── routes/
│   ├── captain.routes.js
│   ├── maps.routes.js
│   ├── ride.routes.js
│   └── user.routes.js
├── services/
│   ├── captain.service.js
│   ├── maps.service.js
│   ├── ride.service.js
│   └── user.service.js
└── utils/
```

---

## Server bootstrap and app flow

### 1) Entry point

The backend starts in [server.js](server.js):

```js
const http = require("http");
const app = require("./app");
const port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

### 2) Application setup

The Express app is created in [app.js](app.js):

```js
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapsRoutes = require("./routes/maps.routes");
const rideRoutes = require("./routes/ride.routes");

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/maps", mapsRoutes);
app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/rides", rideRoutes);
```

This means:

- /users handles user authentication and account routes
- /captains handles captain authentication and account routes
- /maps handles geocoding, travel time, and suggestions
- /rides handles ride creation and ride-related operations

### 3) Database connection

MongoDB is connected in [db/db.js](db/db.js):

```js
mongoose.connect(process.env.DB_CONNECT)
```

The app expects a Mongo connection string in the backend environment variables.

---

## Environment variables

Create a .env file inside the Backend folder:

```env
DB_CONNECT=mongodb://localhost:27017/Triply
JWT_SECRET=your_secret_key
PORT=4000
```

### Variable usage

- DB_CONNECT: MongoDB connection string
- JWT_SECRET: secret used to sign JWTs
- PORT: custom port for the Express server

---

## Running the backend

From the backend directory:

```bash
npm install
npx nodemon server.js
```

The app runs at:

```text
http://localhost:4000
```

---

## Authentication model

The project uses JWT-based authentication for both users and captains.

### User token generation

In [models/user.model.js](models/user.model.js):

```js
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};
```

### Captain token generation

In [models/captain.models.js](models/captain.models.js):

```js
captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};
```

### Token verification

The middleware in [middlewares/auth.middlewares.js](middlewares/auth.middlewares.js) verifies the JWT using:

```js
jwt.verify(token, process.env.JWT_SECRET)
```

Accepted auth sources:

- Authorization: Bearer <token>
- Cookie: token=<jwt_token>

### Token blacklist

Logout invalidates tokens by storing them in the blacklist collection. The blacklist model is in [models/blacklistToken.model.js](models/blacklistToken.model.js).

---

## Middleware details

### getTokenFromRequest

This helper checks for a token in:

1. req.cookies.token
2. Authorization header in the form Bearer <token>

### authUser

Used for protected user routes.

Flow:

1. read token from cookie or header
2. check blacklist
3. verify token signature
4. fetch user by _id
5. attach user to req.user
6. continue to controller

### authMiddleware

This is a secondary gate used to ensure req.user exists.

### authCaptain

Used for protected captain routes.

Flow:

1. read token from cookie or header
2. check blacklist
3. verify JWT
4. fetch captain by _id
5. attach captain to req.captain
6. continue to controller

If verification fails, the API responds with 401.

---

## User routes

These are mounted under /users in [routes/user.routes.js](routes/user.routes.js).

### Route table

| Route | Method | Purpose | Auth |
| --- | --- | --- | --- |
| /users/register | POST | register a new user | No |
| /users/login | POST | log in a user | No |
| /users/profile | GET | get current user profile | Yes |
| /users/logout | GET | logout user and blacklist token | Yes |

### 1) Register user

#### Endpoint

```http
POST /users/register
```

#### Validation

- fullname.firstname: minimum 2 characters
- fullname.lastname: minimum 2 characters
- email: valid email format
- password: minimum 6 characters

#### Example body

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "secret123"
}
```

#### Controller logic

The controller validates the payload, checks for duplicate email, hashes the password, creates the document, generates a JWT, and responds with a token and user document.

#### Success response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a7b2d9f1c2d3e4f5a6b7c8",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  }
}
```

#### Error responses

- 400 validation error
- 400 duplicate email
- 500 unexpected internal failure

### 2) Login user

#### Endpoint

```http
POST /users/login
```

#### Validation

- email: valid email
- password: minimum 6 chars

#### Example body

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

#### Controller logic

- find user by email with password selected
- compare password using bcrypt
- generate JWT token
- set cookie named token
- remove password from response
- return user and token

#### Success response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a7b2d9f1c2d3e4f5a6b7c8",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  }
}
```

#### Error responses

- 400 invalid body
- 401 invalid email or password
- 500 server error

### 3) Get user profile

#### Endpoint

```http
GET /users/profile
```

#### Auth requirement

Requires a valid user JWT.

#### Example request

```bash
curl -X GET http://localhost:4000/users/profile \
  -H "Authorization: Bearer <jwt_token>"
```

#### Success response

```json
{
  "user": {
    "_id": "64a7b2d9f1c2d3e4f5a6b7c8",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  }
}
```

#### Error responses

- 401 no token
- 401 invalid token
- 401 blacklisted token

### 4) Logout user

#### Endpoint

```http
GET /users/logout
```

#### Auth requirement

Requires a valid token.

#### Behavior

- gets token from cookie or Authorization header
- clears cookie
- stores token in blacklist collection
- responds with success message

#### Success response

```json
{
  "message": "Logged out successfully"
}
```

---

## Captain routes

These are mounted under /captains in [routes/captain.routes.js](routes/captain.routes.js).

### Route table

| Route | Method | Purpose | Auth |
| --- | --- | --- | --- |
| /captains/register | POST | register a new captain | No |
| /captains/login | POST | log in a captain | No |
| /captains/profile | GET | get current captain profile | Yes |
| /captains/logout | GET | logout captain and blacklist token | Yes |

### 1) Register captain

#### Endpoint

```http
POST /captains/register
```

#### Validation rules

- fullname.firstname: minimum length 3
- fullname.lastname: validated if provided, minimum length 2
- email: valid email and unique
- password: minimum length 6
- vehicle.color: minimum length 3
- vehicle.numberplate: minimum length 4
- vehicle.capacity: integer >= 1
- vehicle.vehicalType: one of car, bike, van, auto, moto

> This project uses the spelling vehicalType consistently, not vehicleType.

#### Example body

```json
{
  "fullname": {
    "firstname": "Rajesh",
    "lastname": "Kumar"
  },
  "email": "rajesh.captain@example.com",
  "password": "Captain@123",
  "vehicle": {
    "color": "Black",
    "numberplate": "MH02AB1234",
    "capacity": 4,
    "vehicalType": "car"
  }
}
```

#### Controller behavior

- validate request
- check for duplicate email
- create captain profile using service
- hash password
- create MongoDB document
- generate JWT token
- return captain data + token

#### Success response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "64a7b2d9f1c2d3e4f5a6b7c9",
    "fullname": {
      "firstname": "Rajesh",
      "lastname": "Kumar"
    },
    "email": "rajesh.captain@example.com",
    "vehicle": {
      "color": "Black",
      "numberplate": "MH02AB1234",
      "capacity": 4,
      "vehicalType": "car"
    },
    "status": "active"
  }
}
```

#### Error responses

- 400 validation issues
- 400 duplicate captain
- 400 or 500 unexpected exception

### 2) Login captain

#### Endpoint

```http
POST /captains/login
```

#### Example body

```json
{
  "email": "rajesh.captain@example.com",
  "password": "Captain@123"
}
```

#### Controller behavior

- validate body
- find captain by email and include password
- bcrypt compare provided password
- generate token
- set cookie token
- remove password from response
- return captain object and token

#### Success response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "captain": {
    "_id": "64a7b2d9f1c2d3e4f5a6b7c9",
    "fullname": {
      "firstname": "Rajesh",
      "lastname": "Kumar"
    },
    "email": "rajesh.captain@example.com",
    "status": "active"
  }
}
```

#### Error responses

- 400 invalid body
- 401 invalid email or password
- 500 unexpected server issue

### 3) Get captain profile

#### Endpoint

```http
GET /captains/profile
```

#### Auth requirement

Requires authCaptain.

#### Example request

```bash
curl -X GET http://localhost:4000/captains/profile \
  -H "Authorization: Bearer <jwt_token>"
```

#### Success response

```json
{
  "captain": {
    "_id": "64a7b2d9f1c2d3e4f5a6b7c9",
    "fullname": {
      "firstname": "Rajesh",
      "lastname": "Kumar"
    },
    "email": "rajesh.captain@example.com",
    "vehicle": {
      "color": "Black",
      "numberplate": "MH02AB1234",
      "capacity": 4,
      "vehicalType": "car"
    },
    "status": "active"
  }
}
```

#### Error responses

- 401 no token provided
- 401 invalid token
- 401 blacklisted token

### 4) Logout captain

#### Endpoint

```http
GET /captains/logout
```

#### Auth requirement

Requires valid captain token.

#### Behavior

- read token from cookie or Authorization header
- clear cookie
- blacklist token
- return success message

#### Success response

```json
{
  "message": "Logged out successfully"
}
```

---

## Map routes

These are mounted under /maps in [routes/maps.routes.js](routes/maps.routes.js).

### Route table

| Route | Method | Purpose | Auth |
| --- | --- | --- | --- |
| /maps/get-coordinates | GET | geocode address to lat/lng | Yes |
| /maps/get-distance-time | GET | calculate distance and ETA | Yes |
| /maps/get-suggestions | GET | get autocomplete suggestions | Yes |

### 1) Get coordinates

#### Endpoint

```http
GET /maps/get-coordinates
```

#### Query parameters

```text
address=<location name or address>
```

#### Example

```bash
curl "http://localhost:4000/maps/get-coordinates?address=Howrah"
```

#### Response

```json
{
  "latitude": 22.5796,
  "longitude": 88.3299
}
```

### 2) Get distance and time

#### Endpoint

```http
GET /maps/get-distance-time
```

#### Query parameters

```text
origin=<starting address>
destination=<ending address>
```

#### Example

```bash
curl "http://localhost:4000/maps/get-distance-time?origin=Howrah&destination=Salt%20Lake"
```

#### Response

```json
{
  "distance": "18.42 km",
  "time": "28 minutes"
}
```

### 3) Get suggestions

#### Endpoint

```http
GET /maps/get-suggestions
```

#### Query parameters

```text
input=<search text>
```

#### Example

```bash
curl "http://localhost:4000/maps/get-suggestions?input=kolkata"
```

#### Response

```json
[
  {
    "place_id": 123456,
    "display_name": "Kolkata, West Bengal, India",
    "lat": "22.5726",
    "lon": "88.3639"
  }
]
```

---

## Ride routes

These are mounted under /rides in [routes/ride.routes.js](routes/ride.routes.js).

### Route table

| Route | Method | Purpose | Auth |
| --- | --- | --- | --- |
| /rides/create | POST | create ride request | Yes |

### Create ride

#### Endpoint

```http
POST /rides/create
```

#### Validation

- pickup: required string
- destination: required string
- vehicleType: must be one of auto, car, moto

#### Example body

```json
{
  "pickup": "Howrah Station",
  "destination": "Salt Lake Sector V",
  "vehicleType": "car"
}
```

#### Controller behavior

- validates input
- uses req.user._id as the rider
- calls ride service to compute fare, distance, and duration
- creates a ride record with random OTP
- returns ride document

#### Success response

```json
{
  "_id": "64a7b2d9f1c2d3e4f5a6b7ca",
  "user": "64a7b2d9f1c2d3e4f5a6b7c8",
  "pickup": "Howrah Station",
  "destination": "Salt Lake Sector V",
  "fare": 1025,
  "distance": 24.31,
  "duration": 42,
  "status": "pending",
  "otp": "123456"
}
```

#### Error responses

- 400 invalid input
- 400 invalid vehicle type
- 400 route calculation failure

---

## Data models

### User model

File: [models/user.model.js](models/user.model.js)

Fields:

- fullname.firstname
- fullname.lastname
- email
- password
- sockerId

Methods:

- generateAuthToken()
- comparePassword()
- hashPassword()

User JWT expiration: 1 hour

### Captain model

File: [models/captain.models.js](models/captain.models.js)

Fields:

- fullname.firstname
- fullname.lastname
- status
- vehicle.color
- vehicle.numberplate
- vehicle.capacity
- vehicle.vehicalType
- email
- password

Methods:

- generateAuthToken()
- comparePassword()
- hashPassword()

Captain JWT expiration: 24 hours

### Ride model

File: [models/ride.models.js](models/ride.models.js)

Fields:

- user
- captain
- pickup
- destination
- fare
- status
- duration
- distance
- paymentId
- signature
- otp

Status enum:

- pending
- accepted
- ongoing
- completed
- cancelled

---

## Services

### User service

File: [services/user.service.js](services/user.service.js)

Main tasks:

- create and manage user records
- support account registration logic

### Captain service

File: [services/captain.service.js](services/captain.service.js)

Main tasks:

- validate captain registration data
- hash password
- create captain document

### Maps service

File: [services/maps.service.js](services/maps.service.js)

Main tasks:

- getAddressCoordinates(address)
- getDistanceAndTime(origin, destination)
- getAutoCompleteSuggestions(input)

Uses:

- OpenStreetMap Nominatim for geocoding and suggestions
- OSRM routing API for driving distance and ETA

### Ride service

File: [services/ride.service.js](services/ride.service.js)

Main tasks:

- getFare(pickup, destination)
- createRide({ user, pickup, destination, vehicleType })

Fare calculation uses:

- base fare by vehicle type
- per-km rate
- per-minute rate
- traffic/delay buffer approximation

---

## Controllers

### User controller

File: [controllers/user.controller.js](controllers/user.controller.js)

Handles:

- registerUser
- loginUser
- getUserProfile
- logoutUser

### Captain controller

File: [controllers/captain.controller.js](controllers/captain.controller.js)

Handles:

- registerCaptain
- loginCaptain
- getCaptainProfile
- logoutCaptain

### Map controller

File: [controllers/map.controller.js](controllers/map.controller.js)

Handles:

- getCoordinates
- getDistanceAndTime
- getAutoCompleteSuggestions

### Ride controller

File: [controllers/ride.controller.js](controllers/ride.controller.js)

Handles:

- creatoride
- getFare

---

## Common response patterns

### Validation errors

```json
{
  "errors": [
    {
      "msg": "Password must be at least 6 characters long",
      "param": "password",
      "location": "body"
    }
  ]
}
```

### Unauthorized

```json
{
  "message": "Invalid token."
}
```

### Duplicate account

```json
{
  "message": "Captain already exist"
}
```

### Logout success

```json
{
  "message": "Logged out successfully"
}
```

---

## Error pattern summary

| Status | Meaning |
| --- | --- |
| 400 | validation error/incomplete data/duplicate account |
| 401 | missing/invalid/expired/blacklisted token |
| 404 | location or route not found in map service |
| 500 | unexpected server or database failure |

---

## Notes and implementation observations

- The backend is a working API foundation for a ride-booking app, not a full production ride-matching system yet.
- User and captain flow is implemented with JWT + cookie fallback.
- The ride flow currently supports create ride and fare estimation logic via service methods.
- Map use is based on OpenStreetMap/Nominatim and OSRM rather than a premium provider.
- The spelling vehicalType is used throughout the codebase and should be kept consistent in API requests.
- Login and registration store hashed passwords with bcrypt.
- The app uses MongoDB collections for users, captains, rides, and blacklist tokens.

---

## Quick reference

### User register

```bash
POST /users/register
```

### User login

```bash
POST /users/login
```

### User profile

```bash
GET /users/profile
Authorization: Bearer <jwt_token>
```

### Captain register

```bash
POST /captains/register
```

### Captain login

```bash
POST /captains/login
```

### Captain profile

```bash
GET /captains/profile
Authorization: Bearer <jwt_token>
```

### Map coordinates

```bash
GET /maps/get-coordinates?address=Howrah
```

### Ride creation

```bash
POST /rides/create
Authorization: Bearer <jwt_token>
```

---

## Related files

- [app.js](app.js)
- [server.js](server.js)
- [db/db.js](db/db.js)
- [middlewares/auth.middlewares.js](middlewares/auth.middlewares.js)
- [routes/user.routes.js](routes/user.routes.js)
- [routes/captain.routes.js](routes/captain.routes.js)
- [routes/maps.routes.js](routes/maps.routes.js)
- [routes/ride.routes.js](routes/ride.routes.js)
- [controllers/user.controller.js](controllers/user.controller.js)
- [controllers/captain.controller.js](controllers/captain.controller.js)
- [controllers/map.controller.js](controllers/map.controller.js)
- [controllers/ride.controller.js](controllers/ride.controller.js)
- [models/user.model.js](models/user.model.js)
- [models/captain.models.js](models/captain.models.js)
- [models/ride.models.js](models/ride.models.js)
- [services/maps.service.js](services/maps.service.js)
- [services/ride.service.js](services/ride.service.js)
- [models/blacklistToken.model.js](models/blacklistToken.model.js)
