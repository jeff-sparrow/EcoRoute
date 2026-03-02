# EcoRoute Backend (`server`)

Express backend implementing the MVP requirements from EcoRoute documentation:

- `POST /api/routes` for low-carbon route ranking
- Weather/AQI context-aware warnings
- Carbon calculation engine
- User, saved routes, trip history, and dashboard endpoints

## Stack

- Node.js 18+
- Express
- Axios
- Zod

## Setup

```bash
cd server
npm install
cp .env.example .env
```

Add API keys to `.env` for live integrations:

- `OPENROUTESERVICE_API_KEY`
- `OPENWEATHERMAP_API_KEY`

The API still works without keys using fallback routing/weather assumptions.

## Run

```bash
npm run dev
```

Server default URL: `http://localhost:4000`

## Endpoints

- `GET /api/health`
- `POST /api/routes`
- `POST /api/users`
- `GET /api/users/:userId/dashboard`
- `GET /api/users/:userId/saved-routes`
- `POST /api/users/:userId/saved-routes`
- `GET /api/users/:userId/trips`
- `POST /api/users/:userId/trips`

## How API integration works in this backend

The backend follows a request -> processing -> response pattern for every endpoint:

- **Request:** The frontend sends JSON to an API endpoint (for example, `POST /api/routes`).
- **Validation and processing:** The backend validates request payloads with Zod, then runs business logic (for example, weather lookup, route ranking, and carbon calculations).
- **Response:** The backend returns structured JSON with result data or a clear error payload.

### Endpoint-specific behavior

- **`GET /api/health`**
  - Returns service status metadata (`status`, `service`, `timestamp`) for uptime checks.

- **`POST /api/routes`**
  - Expects route-planning data such as `start`, `end`, `preferredModes`, and `maxResults`.
  - Validates the payload, gathers weather context, ranks low-carbon route options, and returns:
    - `query` (validated request)
    - `weather` (context used for ranking)
    - `routes` (ranked options)
    - `meta` (sorting and timestamp details)

- **`POST /api/users`**
  - Creates a user record and returns the new user object with a generated `userId`.

- **`GET /api/users/:userId/dashboard`**
  - Aggregates trip history into dashboard metrics (trip count, total carbon saved, badges).

- **`GET/POST /api/users/:userId/saved-routes`**
  - `GET` returns all saved routes for a user.
  - `POST` validates and stores a new saved route, then returns the created route.

- **`GET/POST /api/users/:userId/trips`**
  - `GET` returns logged trips for a user.
  - `POST` validates trip input, calculates `carbonSavedGrams`, stores the trip, and returns it.

### Error handling

- Invalid request payloads return **HTTP 400** with validation details.
- Unknown users return **HTTP 404**.
- Unexpected failures are passed to centralized error middleware for consistent JSON error responses.

## Example route request

```json
{
  "start": { "lat": 44.5646, "lon": -123.2620, "name": "Corvallis" },
  "end": { "lat": 45.5152, "lon": -122.6784, "name": "Portland" },
  "greenToleranceMinutes": 20,
  "preferredModes": ["walk", "bike", "bus", "car", "ev"],
  "maxResults": 4
}
```

## Notes

- Carbon is the primary ranking signal; time tolerance is a secondary adjustment.
- GTFS real-time is stubbed as estimated bus routing for MVP.
- Data is currently in-memory and should be replaced by PostgreSQL + PostGIS in the next iteration.
