# Simple MERN Login Form

A beginner-friendly login and registration app built with React, Express, MongoDB, Mongoose, JWT, and bcryptjs.

## Requirements

- Node.js 20 or later and npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Configure the backend

Open a terminal in the project root and install the server dependencies:

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Edit `server/.env` and set `MONGODB_URI` to your local MongoDB URI or Atlas connection string. Create a private JWT secret in PowerShell with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated value into `JWT_SECRET` in `server/.env`. Do not commit or share that file.

Start the backend in this terminal:

```powershell
npm run dev
```

The API runs at `http://localhost:5000`. Keep MongoDB running.

## Configure the frontend

Open a second terminal in the project root and run:

```powershell
cd client
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). The client sends API requests to `http://localhost:5000` by default. To use a different API URL, create `client/.env` with `VITE_API_URL=http://localhost:5000/api`.

## Use the app

1. Choose **Register** and create an account with your name, email, and a password of at least eight characters.
2. Sign in with that email and password.
3. The dashboard shows your name. Use **Log out** to end the session in this browser.

The API provides `POST /api/auth/register`, `POST /api/auth/login`, and the JWT-protected `GET /api/auth/me` endpoint. Registration and login return a signed token; the client stores it in local storage and sends it as a bearer token for the current-user request. Passwords are hashed with bcryptjs before they are stored.

## Project files

### `client/` — React frontend

- `package.json` — frontend dependencies and Vite commands.
- `index.html` — the browser page that loads the React app.
- `vite.config.js` — Vite development-server configuration.
- `src/main.jsx` — React entry point and router setup.
- `src/App.jsx` — page routes and protected-dashboard loading.
- `src/api/axios.js` — Axios API client and bearer-token header.
- `src/context/AuthContext.jsx` — login state, current-user loading, and logout.
- `src/components/ProtectedRoute.jsx` — sends signed-out visitors to login.
- `src/pages/Login.jsx` — login form, validation, errors, and password visibility.
- `src/pages/Register.jsx` — registration form and client-side validation.
- `src/pages/Dashboard.jsx` — current user's greeting and logout button.
- `src/styles.css` — responsive layout and form styling.

### `server/` — Express API

- `package.json` — backend dependencies and development command.
- `.env.example` — names of required configuration values without real secrets.
- `src/server.js` — loads configuration, connects to MongoDB, and starts Express.
- `src/app.js` — Express middleware, API routes, and error handling.
- `src/models/User.js` — Mongoose user schema with unique normalized email.
- `src/controllers/authController.js` — registration, login, and current-user handlers.
- `src/routes/authRoutes.js` — authentication API endpoints.
- `src/middleware/authenticateToken.js` — validates bearer JWTs.

The root `.gitignore` excludes environment files, dependencies, and generated build output.
