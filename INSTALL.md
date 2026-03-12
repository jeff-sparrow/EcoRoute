# EcoRoute – Installation Guide

## 1. Overview

EcoRoute is a web-based navigation application that helps users choose environmentally friendly routes between two locations.

This document explains how to **access and run the EcoRoute application**.

---

# 2. Live Application (Recommended)

The easiest way to use EcoRoute is through the deployed application.

Frontend URL:

```
https://eco-client-sandy.vercel.app/
```

Users can access the application directly using a modern web browser.

Supported browsers:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

No installation is required for normal users.

---

# 3. Running the Application Locally

Developers or advanced users may run the application locally.

## Prerequisites

Install the following software before running EcoRoute:

* Node.js (v18 or later)
* npm (comes with Node.js)
* Git

Verify installation:

```
node -v
npm -v
git --version
```

---

# 4. Clone the Repository

```
git clone https://github.com/jeff-sparrow/EcoRoute.git
cd EcoRoute
```

---

# 5. Navigate to Frontend

```
cd client
```

---

# 6. Install Dependencies

Install all required packages listed in `package.json`.

```
npm install
```

---

# 7. Environment Configuration

EcoRoute uses environment variables to connect to external services such as routing APIs and backend services.

Create a `.env` file inside the **client** directory.

Example:

```
client/.env
```

Add the following configuration:

```
VITE_ORS_API_KEY= Register to get API_KEY https://account.heigit.org/signup
VITE_BACKEND_URL=https://ecoserver-3v5x.onrender.com
```

### Environment Variables

| Variable         | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| VITE_ORS_API_KEY | API key for OpenRouteService used to generate routes         |
| VITE_BACKEND_URL | Backend server URL used for route storage and authentication |

---

# 8. Start Development Server

Run the following command:

```
npm run dev
```

The application will start at:

```
http://localhost:5173
```

Open the URL in your browser to use EcoRoute.

---

# 9. Changing Development Port

The development server port can be changed in the **vite.config.ts** file.

Example configuration:

```
export default defineConfig({
  server: {
    port: 3000
  }
})
```

After changing the port, restart the development server:

```
npm run dev
```

The application will then run on:

```
http://localhost:3000
```

---

# 10. Available Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| npm run dev     | Start development server |
| npm run build   | Build production version |
| npm run preview | Preview production build |
| npm run lint    | Run ESLint code checks   |

---

# 11. Project Dependencies

Main libraries used in this project:

* React
* TypeScript
* Vite
* Material UI
* React Router
* React Query
* Zustand
* Axios
* Leaflet

These dependencies are automatically installed using:

```
npm install
```

---

# 12. Troubleshooting

## Port Already in Use

If port `5173` is already in use:

```
npm run dev -- --port 3000
```

---

## Node Not Recognized

Check Node installation:

```
node -v
npm -v
```

If Node is not installed, download it from:

```
https://nodejs.org/
```

Install the **LTS version**.

---

# 13. Support

If you encounter issues:

1. Visit the GitHub repository
2. Open the **Issues** tab
3. Create a new issue describing the problem

Repository:

```
https://github.com/jeff-sparrow/EcoRoute
```

# EcoRoute – Backend Installation Guide

## 1. Overview

It is responsible for:

- User authentication
- Route generation using external APIs
- Carbon emission calculations
- Trip history storage
- Saved route management
- Database communication

The backend is built using:

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **PostGIS (geospatial extension)**

---

# 2. Backend Architecture

The backend follows a **layered architecture** to keep the code modular and maintainable.

server
│
├── src
│ ├── config → database configuration
│ ├── controllers → request handling logic
│ ├── routes → API route definitions
│ ├── services → external API logic
│ ├── middleware → authentication middleware
│ └── database → schema and initialization
│
├── server.js → application entry point
└── package.json → dependencies


Main responsibilities:

| Component | Purpose |
|--------|--------|
| controllers | Process API requests |
| routes | Define API endpoints |
| services | Handle external APIs (routing, weather, carbon) |
| config | Database connection |
| middleware | Authentication validation |

---

# 3. System Requirements

Before running the backend server, install the following software:

| Software | Version |
|--------|--------|
| Node.js | v18 or later |
| npm | Latest |
| PostgreSQL | v14 or later |
| PostGIS | Extension enabled |
| Git | Latest |

Verify installation:

```
node -v
npm -v
git --version
psql --version
```
---

# 4. Clone the Repository

Clone the project repository:
```
git clone https://github.com/jeff-sparrow/EcoRoute.git

cd EcoRoute

```
Navigate to the backend folder:
```
cd server
```

---

# 5. Install Dependencies

Install backend dependencies listed in `package.json`.

```
npm install
```

Main dependencies used:

| Library | Purpose |
|------|------|
| express | Web server framework |
| pg | PostgreSQL client |
| bcrypt | Password hashing |
| jsonwebtoken | Authentication tokens |
| axios | External API requests |
| dotenv | Environment variables |
| cors | Cross-origin support |

Development dependency:

```
nodemon
```

For automatically restarting the server during development.

---

# 6. Environment Configuration

Create a `.env` file in the **server** directory.

Example:

`server/.env`

Add following configuration:
```
DATABASE_URL=postgres://postgres:password@localhost:5432/ecoroute

ORS_API_KEY=your_openrouteservice_api_key

WEATHER_API_KEY=your_weather_api_key

JWT_SECRET=your_secret_key
```

### Environment Variables

| Variable | Description |
|--------|--------|
| DATABASE_URL | PostgreSQL database connection string |
| ORS_API_KEY | OpenRouteService API key used for route generation |
| WEATHER_API_KEY | Weather API used for weather-aware routing |
| JWT_SECRET | Secret used for signing authentication tokens |

---

# 7. Database Setup

Create the project database:

`createdb ecoroute`


Connect to the database:

`psql ecoroute`


Enable **PostGIS extension**:

```
CREATE EXTENSION postgis;
CREATE EXTENSION pgcrypto;
```

Import the project schema

Example tables include:

- users
- trips
- saved_routes

These tables store:

| Table | Purpose |
|------|------|
| users | Registered users |
| trips | Trip history |
| saved_routes | Routes bookmarked by users |

---

# 8. Start the Backend Server

Start the backend server:
`npm start`

Server will run on:

`http://localhost:5000`


Expected response:
```
{
"message": "EcoRoute Backend Running"
}
```


Test database connection:
`http://localhost:5000/test-db`


Example response:
{
"message": "Database connected!",
"time": "2026-03-10T12:34:56.000Z"
}


---

# 10. Available API Endpoints

The backend exposes several REST API endpoints.

### Authentication

| Method | Endpoint | Description |
|------|------|------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login and receive JWT token |

---

### Trip Management

| Method | Endpoint | Description |
|------|------|------|
| POST | `/api/trip` | Save a trip |
| GET | `/api/trips/:userId` | Retrieve trip history |

---

### Saved Routes

| Method | Endpoint | Description |
|------|------|------|
| POST | `/api/save-route` | Save a route |
| GET | `/api/saved-routes/:userId` | Get saved routes |
| DELETE | `/api/del-saved-route/:id` | Delete saved route(not implented due to time complexity) |
| PATCH | `/api/update-co2/:id` | Update route CO₂ score (not implented due to time complexity)|

---

# 11. Authentication

Authentication implemented using **JSON Web Tokens (JWT)**.

Workflow:

1. User registers or logs in.
2. Backend generates a JWT token.
3. Frontend stores the token.
4. Protected requests include the token.

Example request header:

`Authorization: Bearer <token>`


---

## Authentication API
### Register User

POST

`https://ecoserver-3v5x.onrender.com/api/register`

- Request Body
```
{
  "name": "test",
  "email": "test@example.com",
  "password": "testpass"
}
```
- Response

```
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "Farid",
    "email": "farid@example.com"
  }
}
```
### Login

POST

`https://ecoserver-3v5x.onrender.com/api/login`
- Request Body
{
  "email": "farid@example.com",
  "password": "password123"
}
- Response
```
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "Farid",
    "email": "farid@example.com"
  }
}
```
- Token in Frontend
```
headers: {
  Authorization: `Bearer ${token}`
}
```
### Trip API

- Save Trip

POST

`https://ecoserver-3v5x.onrender.com/api/trip`

```
{
  "user_id": "b9ed1997-7d4a-468d-868e-03760a675d29",
  "trip_name": "Morning Walk",
  "start_name": "Home",
  "end_name": "Office",
  "start": [-123.071761, 44.044397],
  "end": [-123.0950506, 44.0505054],
  "mode": "walk",
  "distance_km": 2.32,
  "duration_minutes": 27,
  "route_co2_kg": 0.463,
  "carbon_saved_kg": 0
}
```

**Coordinates must be provided in the format**:

`[longitude, latitude]`

### Get Trip History

- GET
`https://ecoserver-3v5x.onrender.com/api/trips/:userId`

- Example
`https://ecoserver-3v5x.onrender.com/api/trips/e0c08866-3c9c-4e6f-87e7-c572fc18ec74`

- Response
```
{
  "id": "56c4b68e-0b22-440b-9a35-d0452f2474d5",
  "trip_name": "Morning Walk",
  "start_name": "Home",
  "end_name": "Office",
  "start": [-123.071761, 44.044397],
  "end": [-123.0950506, 44.0505054],
  "mode": "walk",
  "distance_km": "2.32",
  "duration_minutes": 27,
  "route_co2_kg": 0.463,
  "carbon_saved_kg": 0,
  "created_at": "2026-03-09T06:22:38.192Z"
}
```

## Saved Routes API
### Save Route

- POST
`https://ecoserver-3v5x.onrender.com/api/save-route`

- Request Body
```
{
  "user_id": "83f96599-d7cd-4780-a2de-a8dc7299e7f4",
  "start_name": "Home",
  "end_name": "Office",
  "start": [-123.071761, 44.044397],
  "end": [-123.0950506, 44.0505054],
  "mode": "bike",
  "last_co2_score": 0
}
```

- Response
```
{
  "message": "Route saved successfully"
}
```

- Delete Saved Route
- DELETE
`https://ecoserver-3v5x.onrender.com/api/del-saved-route/:id`
- Example:
`https://ecoserver-3v5x.onrender.com/api/del-saved-route/a0f1181b-e411-493c-9266-c2ef1afcd676`
```
{
  "message": "Saved route deleted"
}
```

### Update CO₂ Score

- PATCH

- Example:
`https://ecoserver-3v5x.onrender.com/api/update-co2/1db68e1c-7c1a-40e7-99d1-942d8149fd43`
- Request Body
```
{
  "last_co2_score": 0.69
}
```
- Response
{
  "message": "CO2 score updated"
}

**PostMan to test these API**