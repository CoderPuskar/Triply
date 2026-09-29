# Triply Frontend

The Triply frontend is a React single-page application for user and captain ride-booking flows. It is built with Vite and styled with Tailwind CSS.

## Current Features

- Triply landing page with a taxi image and start button
- User sign-up and login screens
- Captain sign-up and login screens
- Navigation between user and captain flows
- Terms and Conditions modal on both sign-up screens
- Initial user state provided through React Context
- API-connected rider and captain registration and login, with JWT tokens saved for later requests
- Protected rider and captain pages that validate the saved session with the backend
- Rider booking flow with location autocomplete, map interaction, vehicle selection, fare estimation, and ride creation
- Captain dashboard with incoming ride requests, trip information, confirmation, daily activity statistics, and ride controls
- Active ride screens for riders and captains, including OTP-based ride start and ride completion
- Leaflet maps with pickup/destination markers and route lines
- Socket.IO connection for ride events and live location updates
- Logout actions that call the API and clear the local session

The frontend authenticates through the backend API. It stores the returned JWT in local storage and includes it in protected requests. Live ride and location events are delivered over Socket.IO.

## Routes

| Path | Screen |
| --- | --- |
| `/` | Home |
| `/login` | User login |
| `/signup` | User sign-up |
| `/captain-login` | Captain login |
| `/captain-signup` | Captain sign-up |
| `/home` | Protected rider booking dashboard |
| `/riding` | Rider's active ride screen |
| `/user/logout` | Protected rider logout action |
| `/captain-home` | Protected captain dashboard and ride requests |
| `/captain-riding` | Protected captain active ride screen |
| `/captain/logout` | Protected captain logout action |
| `/captain-logout` | Alternate protected captain logout route |

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

The app calls the backend for registration, login, profile checks, logout, map lookups, fare estimates, and ride actions. The Vite configuration proxies `/users`, `/captains`, `/maps`, `/rides`, and `/socket.io` to `http://127.0.0.1:4000` during development. Configure the frontend API base URL with `VITE_BASE_URL` when needed; for local development this is normally `http://localhost:4000`.

## Rider booking flow

1. The rider signs up or logs in, and the app saves the returned JWT.
2. The protected `/home` screen requests the rider profile and opens the booking interface.
3. The rider enters or selects pickup and destination locations. Search suggestions and coordinate/route lookups are provided by the backend.
4. The app requests an estimate, lets the rider select a vehicle, then submits the ride request.
5. The captain can confirm the request. The rider receives ride events over Socket.IO and sees the active trip on `/riding`.
6. While the ride is accepted or underway, location updates can be displayed on the map. The captain enters the ride OTP to start and ends the ride when complete.

## Captain flow

1. A captain creates an account with vehicle details or signs in.
2. The protected captain dashboard joins the live connection and shares the captain's location when available.
3. The backend finds nearby online captains when a rider creates a request and sends a `newRide` event.
4. The captain reviews and confirms a ride. The rider is notified through a live event.
5. The captain starts the ride with the generated OTP, sees the active route, and ends the ride on completion.

The browser's geolocation permission is needed for live device location. Address search and road route calculations rely on the backend and external map services.
