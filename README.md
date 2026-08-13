# Triply

RideFlow is a full-stack ride booking platform built with the MERN stack. It supports rider and driver workflows, user authentication, booking management, fare calculation, ride tracking, and an admin dashboard.

## Overview

Triply is designed to simplify the process of booking rides, assigning drivers, and managing trip activity in a modern web application.

## Features

- Rider registration and authentication
- Driver and passenger role flows
- Ride booking and trip creation
- Fare estimation and trip cost logic
- Driver assignment and ride status tracking
- Admin overview for platform management
- REST API backend for handling user and trip operations

## Tech Stack

- Frontend: React / Next.js / other client app stack
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT-based authentication

## Project Structure

```bash
Triply/
├── README.md
├── Backend/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── README.md
│   ├── controllers/
│   ├── db/
│   ├── models/
│   ├── routes/
│   └── services/
└── Frontend/   (if added later)
```

## Backend API

The backend contains the user registration API and related route logic.

### User Registration Endpoint

- Method: POST
- Route: /users/register
- Description: Registers a new user account with full name, email, and password

For full request and response details, see [Backend/README.md](Backend/README.md).

## Example Request

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

## API Workflow / Function Call Flow

The registration request follows this flow in the backend:

1. The client sends a `POST` request to `/users/register`.
2. The route in [Backend/routes/user.routes.js](Backend/routes/user.routes.js) receives the request and runs validation rules for:
   - `fullname.firstname`(String)
   - `fullname.lastname`(String)
   - `email`(String)
   - `password`(String)
   - `token`(JWT token)
3. The validated request is passed to the controller in [Backend/controllers/user.controller.js](Backend/controllers/user.controller.js).
4. The controller calls `userModel.hashPassword(password)` to hash the password.
5. The controller then calls `userService.createUser(...)` in [Backend/services/user.service.js](Backend/services/user.service.js).
6. The service creates the new user document using the Mongoose model from [Backend/models/user.model.js](Backend/models/user.model.js).
7. The controller generates a JWT token using `user.generateAuthToken()`.
8. The API responds with `201 Created` and returns the created user plus the token.

### High-Level Flow

```text
Client
  -> app.js
  \-> routes/user.routes.js
  \-> controllers/user.controller.js
  \-> services/user.service.js
  \-> models/user.model.js
  \-> MongoDB
  \-> response with user + token
```

## Local Setup

1. Open the backend folder:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the backend server with Nodemon:

```bash
npx nodemon
```

4. Use the API at:

```bash
http://localhost:4000
```

> Important: This project runs locally on port 4000, and the development server is started with `npx nodemon`.

## Notes

This project is currently in active backend development, with user registration being one of the core endpoints. More modules and frontend features can be added as the application grows.
