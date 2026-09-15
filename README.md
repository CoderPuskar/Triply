# Triply

Triply is a full-stack ride-booking application built with React on the frontend and Express + MongoDB on the backend. The app supports user and captain flows, protected authentication, map-based pickup/destination search, and ride creation for a ride-hailing experience.

## Overview

This repository is organized as a monorepo with two main parts:

- Backend: Node.js + Express API with MongoDB and JWT authentication
- Frontend: React + Vite + Tailwind-based UI for booking and ride tracking flows

The app currently includes user and captain signup/login, protected profile access, location suggestions, distance/time lookup, and ride creation endpoints.

## Features

- User registration and login
- Captain registration and login
- JWT-based protected routes
- Logout with token handling
- MongoDB integration with Mongoose
- Map API support for coordinate and distance queries
- Ride creation flow for pickup and destination requests
- React frontend for booking flow and ride status panels
- Responsive UI with GSAP animations and Leaflet map integration

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Express Validator
- Cookie Parser
- CORS
- dotenv

### Frontend

- React
- Vite
- Tailwind CSS
- GSAP
- Leaflet + React Leaflet
- React Router DOM
- Remixicon

## Project Structure

```bash
Triply/
├── README.md
├── package.json
├── Backend/
│   ├── .env
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── README.md
│   ├── CAPTAIN_API.md
│   ├── controllers/
│   │   ├── captain.controller.js
│   │   ├── map.controller.js
│   │   ├── ride.controller.js
│   │   └── user.controller.js
│   ├── db/
│   │   └── db.js
│   ├── middlewares/
│   │   └── auth.middlewares.js
│   ├── models/
│   │   ├── blacklistToken.model.js
│   │   ├── captain.models.js
│   │   ├── ride.models.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── captain.routes.js
│   │   ├── maps.routes.js
│   │   ├── ride.routes.js
│   │   └── user.routes.js
│   ├── services/
│   │   ├── captain.service.js
│   │   ├── maps.service.js
│   │   ├── ride.service.js
│   │   └── user.service.js
│   └── utils/
│       └── (if used in future)
├── Frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── assets/
│       ├── components/
│       ├── context/
│       └── pages/
└── postman/
    ├── collections/
    ├── environments/
    ├── flows/
    ├── globals/
    └── mocks/
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MongoDB running locally or reachable via a remote URI
- A valid `.env` file in the Backend folder

## Environment Setup

Create a `.env` file inside the `Backend` folder with the following values:

```env
DB_CONNECT=mongodb://localhost:27017/Triply
JWT_SECRET=your_secret_key
PORT=4000
```

> Adjust the MongoDB URI if you are using a cloud MongoDB instance.

## Running the Backend

From the project root:

```bash
cd Backend
npm install
npx nodemon server.js
```

If nodemon is not installed globally, the project includes it in dev dependencies, so `npx nodemon` works correctly.

The backend server runs on:

```text
http://localhost:4000
```

## Running the Frontend

From the project root:

```bash
cd Frontend
npm install
npm run dev
```

By default, Vite starts the app on:

```text
http://localhost:5173
```

## API Overview

### User Auth Routes

- `POST /users/register`
- `POST /users/login`
- `GET /users/profile`
- `GET /users/logout`

### Captain Auth Routes

- `POST /captains/register`
- `POST /captains/login`
- `GET /captains/profile`
- `GET /captains/logout`

### Map Routes

- `GET /maps/get-coordinates`
- `GET /maps/get-distance-time`
- `GET /maps/get-suggestions`

### Ride Routes

- `POST /rides/create`

## Authentication Flow

The project uses JWT-based authentication.

1. A user or captain registers or logs in.
2. The server creates a JWT token.
3. The client sends the token in the `Authorization` header or as a cookie.
4. The middleware verifies the token using `process.env.JWT_SECRET`.
5. The authenticated user or captain is attached to the request object.
6. Protected endpoints are allowed to continue.

## Current Status

This project is a working full-stack prototype with:

- backend API services for authentication and ride-related flows
- frontend screens for user booking and captain-side ride lifecycle states
- location-based ride request and vehicle selection interactions

## Notes

- The repo contains both a backend and frontend app in one workspace.
- The backend is the source of truth for authentication and database logic.
- The frontend integrates with the backend APIs for login, signup, map suggestions, and ride creation.

## Next Improvements

Possible future enhancements include:

- complete ride matching flow between user and captain
- live captain assignment and ride status updates
- real-time map tracking
- order history and trip analytics
- production-ready environment configuration and deployment setup

## Function Flow

### User Registration Flow

An example request flow for user registration looks like this:

1. Client sends `POST /users/register`.
2. Route validation runs in [Backend/routes/user.routes.js](Backend/routes/user.routes.js).
3. Request goes to [Backend/controllers/user.controller.js](Backend/controllers/user.controller.js).
4. Controller calls `userModel.hashPassword()` and `userService.createUser()`.
5. User is saved into MongoDB using the schema in [Backend/models/user.model.js](Backend/models/user.model.js).
6. JWT token is generated with `user.generateAuthToken()`.
7. Response is returned with created user data and token.

### Captain Registration Flow

An example request flow for captain registration looks like this:

1. Client sends `POST /captains/register`.
2. Route validation runs in [Backend/routes/captain.routes.js](Backend/routes/captain.routes.js).
3. Validates all required fields: fullname, email, password, and vehicle details (color, numberplate, capacity, vehicalType).
4. Request goes to [Backend/controllers/captain.controller.js](Backend/controllers/captain.controller.js).
5. Controller checks if captain with that email already exists in MongoDB.
6. If not, controller calls `captainService.registerCaptain()`.
7. Service hashes the password using `captainModel.hashPasswrd()`.
8. Captain is saved into MongoDB using the schema in [Backend/models/captain.models.js](Backend/models/captain.models.js).
9. JWT token is generated with `captain.generateAuthToken()` (24-hour expiration).
10. Response is returned with created captain data and token (201 Created).

### Captain Login Flow

1. Client sends `POST /captains/login` with email and password.
2. Route validation runs in [Backend/routes/captain.routes.js](Backend/routes/captain.routes.js).
3. Controller finds the captain by email and compares the password with bcrypt.
4. JWT token is generated with `captain.generateAuthToken()`.
5. Token is set in a cookie and returned in the response (200 OK).

### Captain Profile Flow

1. Client sends `GET /captains/profile` with a JWT token.
2. `authCaptain` middleware verifies the token and loads the captain into `req.captain`.
3. Controller returns `{ captain: req.captain }` (200 OK).

### Captain Logout Flow

1. Client sends `GET /captains/logout` with a JWT token.
2. `authCaptain` middleware verifies the token.
3. Controller clears the cookie and blacklists the token in MongoDB.
4. Response returns `{ message: "Logged out successfully" }` (200 OK).

## Local Setup

1. Open the backend folder:

```bash
cd Backend
```

1. Install dependencies:

```bash
npm install
```

1. Start MongoDB locally on port 27017.
2. Start the backend with Nodemon:

```bash
npx nodemon
```

1. The server runs on:

```bash
http://localhost:4000
```

## Environment Variables

Create a `.env` file inside the `Backend` folder with at least:

```env
PORT=4000
JWT_SECRET=your_secret_key
MONGO_URI=mongodb://localhost:27017/triply
```

> Note: The exact environment variable names may vary depending on the DB connection file in [Backend/db/db.js](Backend/db/db.js).
