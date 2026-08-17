# Triply

Triply is a backend-first ride booking platform built with Node.js, Express, MongoDB, and JWT authentication. The current implementation focuses on user registration, login, profile access, and protected route security.

## Overview

This project is designed to support a ride-sharing workflow where users can register, log in, receive a JWT token, and access protected profile endpoints. The backend is structured as a clean MVC-like flow using Express routes, controllers, services, and Mongoose models.

## Features

- User registration with validation
- User login with password verification
- JWT generation and authentication
- Protected profile route
- Logout flow with token blacklisting support
- MongoDB connection with Mongoose
- Express API server on port 4000

## Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT (jsonwebtoken)
- Validation: express-validator
- Cookie handling: cookie-parser
- Environment management: dotenv

## Project Structure

```bash
Triply/
├── README.md
├── Backend/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── README.md
│   ├── CAPTAIN_API.md
│   ├── controllers/
│   │   ├── user.controller.js
│   │   └── captain.controller.js
│   ├── db/
│   │   └── db.js
│   ├── middlewares/
│   │   └── auth.middlewares.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── captain.models.js
│   │   └── blacklistToken.model.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   └── captain.routes.js
│   ├── services/
│   │   ├── user.service.js
│   │   └── captain.service.js
│   └── node_modules/
└── Frontend/   (if added later)
```

## Backend API Routes

The project exposes user routes under `/users` and captain routes under `/captains`.

### User Routes

#### 1) Register User

- Method: POST
- Route: `/users/register`
- Description: Creates a new user, hashes the password, and returns a JWT token.

Request body:

````json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "secret1234"
}
```#

### 2) Login User

- Method: POST
- Route: `/users/login`
- Description: Verifies the password and returns the user object and JWT token.

Request body:

```json
{
  "email": "john@example.com",
  "password": "secret1234"
}
````

#### 3) Get User Profile

- Method: GET
- Route: `/users/profile`
- Description: Requires a valid JWT token.
- Auth flow: `authUser` -> `authMiddleware` -> controller

Headers:

```http
Authorization: Bearer <jwt_token>
```

#### 4) Logout User

- Method: GET
- Route: `/users/logout`
- Description: Clears the cookie and optionally blacklists the JWT token.

### Captain Routes

For detailed captain API documentation, see [CAPTAIN_API.md](Backend/CAPTAIN_API.md).

#### 1) Register Captain

- Method: POST
- Route: `/captains/register`
- Description: Creates a new captain with personal and vehicle information, hashes the password, and returns a JWT token.

Request body:

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

#### 2) Login Captain (Commented Out)

- Method: POST
- Route: `/captains/login`
- Description: Verifies the password and returns the captain object and JWT token.

#### 3) Get Captain Profile (Commented Out)

- Method: GET
- Route: `/captains/profile`
- Description: Requires a valid JWT token.

#### 4) Logout Captain (Commented Out)

- Method: GET
- Route: `/users/logout`
- Description: Clears the cookie and optionally blacklists the JWT token.

## Authentication Flow

The backend uses JWT-based authentication for protected routes.

1. User logs in with `/users/login`.
2. The server generates a JWT from the user id.
3. The client sends the token in:
   - the `Authorization` header as `Bearer <token>`, or
   - a cookie named `token`
4. The middleware in [Backend/middlewares/auth.middlewares.js](Backend/middlewares/auth.middlewares.js) checks the token.
5. The token is verified using `jwt.verify(token, process.env.JWT_SECRET)`.
6. The user is loaded from MongoDB and attached to `req.user`.
7. The protected route is allowed to continue.

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

## Local Setup

1. Open the backend folder:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Start MongoDB locally on port 27017.

4. Start the backend with Nodemon:

```bash
npx nodemon
```

5. The server runs on:

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

## Notes

This project is currently in active backend development. The user auth flow and protected routes are the main working features at this stage, and more modules can be added later for rides, drivers, booking logic, and frontend integration.
