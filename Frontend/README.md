# Triply Frontend

The Triply frontend is a React single-page application for user and captain ride-booking flows. It is built with Vite and styled with Tailwind CSS.

## Current Features

- Triply landing page with a taxi image and start button
- User sign-up and login screens
- Captain sign-up and login screens
- Navigation between user and captain flows
- Terms and Conditions modal on both sign-up screens
- Initial user state provided through React Context

Authentication forms currently manage their values locally. API requests and persistent authentication are not connected yet.

## Routes

| Path | Screen |
| --- | --- |
| `/` | Home |
| `/login` | User login |
| `/signup` | User sign-up |
| `/captain-login` | Captain login |
| `/captain-signup` | Captain sign-up |

## Tech Stack

- React 19
- React DOM 19
- React Router DOM 7
- Vite 8
- Tailwind CSS 4
- ESLint 10

## Getting Started

From the `Frontend` directory:

```bash
npm install
npm run dev
```

Vite will print the local development URL, normally `http://localhost:5173`.

## Available Scripts

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

## Project Structure

```text
src/
├── assets/                 # Images used by the application
├── context/
│   └── UserContext.jsx     # Initial user context and provider
├── pages/
│   ├── Home.jsx
│   ├── UserLogin.jsx
│   ├── UserSignup.jsx
│   ├── CaptainLogin.jsx
│   └── CaptainSignup.jsx
├── App.jsx                 # Application routes
├── App.css                 # Component and layout styles
├── index.css               # Global stylesheet entry
└── main.jsx                # React application entry point
```

`main.jsx` mounts the application inside `UserContext` and `BrowserRouter`. The context is exported as `UserDataContext` and currently contains an initial user object with email and name fields.

## Backend

The backend is in the sibling `Backend` directory. Its user and captain API documentation is available in:

- `../Backend/README.md`
- `../Backend/CAPTAIN_API.md`

The frontend still needs API integration for registration, login, logout, profile data, and token handling.
