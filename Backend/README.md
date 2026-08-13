# Backend API Documentation

## User Registration Endpoint

This backend exposes the user registration endpoint at:

- POST /users/register

> Note: In the application code, the router is mounted under `/users`, and the route file defines `/register`. So the complete endpoint is `/users/register`.

### Description

Creates a new user account with a first name, last name, email, and password. The request is validated before saving the user. If valid, the server stores the user and returns a JWT token.

### Request Method

`POST`

### Required Request Body

The request body must be a JSON object in the following format:

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

### Validation Rules

- `fullname.firstname`: required, minimum 2 characters
- `fullname.lastname`: required, minimum 2 characters
- `email`: required, must be a valid email address
- `password`: required, minimum 6 characters

### Example Request

```bash
curl -X POST http://localhost:4000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "password": "secret123"
  }'
```

### Success Response

#### Status Code

`201 Created`

#### Response Body

```json
{
  "user": {
    "_id": "64a7b2d9f1c2d3e4f5a6b7c8",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Validation Error Response

#### Status Code

`400 Bad Request`

#### Response Body

```json
{
  "errors": [
    {
      "msg": "First name must be at least 2 characters long",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

### Status Codes Summary

- `201` - User successfully created
- `400` - Invalid input or validation failed
- `500` - Server error while creating the user

### Notes

- The password is hashed before being saved to the database.
- A JWT token is generated for the newly created user.
- The endpoint requires JSON data in the request body.

---

## User Login Endpoint

This backend exposes the user login endpoint at:

- POST /users/login

> Note: The router is mounted under `/users`, and the route file defines `/login`. So the complete endpoint is `/users/login`.

### Description

Authenticates an existing user by checking the email and password. If valid, the server returns the user details and a JWT token.

### Request Method

`POST`

### Required Request Body

The request body must be a JSON object in the following format:

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

### Validation Rules

- `email`: required, must be a valid email address
- `password`: required, minimum 6 characters

### Example Request

```bash
curl -X POST http://localhost:4000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secret123"
  }'
```

### Success Response

#### Status Code

`200 OK`

#### Response Body

```json
{
  "user": {
    "_id": "64a7b2d9f1c2d3e4f5a6b7c8",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Validation Error Response

#### Status Code

`400 Bad Request`

#### Response Body

```json
{
  "errors": [
    {
      "msg": "Invalid email address",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Unauthorized Response

#### Status Code

`401 Unauthorized`

#### Response Body

```json
{
  "message": "Invalid email or password"
}
```

### Status Codes Summary

- `200` - User logged in successfully
- `400` - Invalid input or validation failed
- `401` - Invalid email or password
- `500` - Server error while logging in

### Notes

- The login endpoint verifies user credentials before issuing a JWT.
- The JWT is used for authenticated future requests.
- The endpoint accepts JSON data in the request body.
