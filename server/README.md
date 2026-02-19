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
