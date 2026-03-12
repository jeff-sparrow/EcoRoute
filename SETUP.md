# EcoRoute – System Setup Guide (SETUP.md)

## Overview

This document describes how a system administrator can deploy the EcoRoute system on a server.

EcoRoute consists of:

* **Frontend:** React + Vite
* **Backend:** Node.js + Express
* **Database:** PostgreSQL + PostGIS

---

# 1. System Requirements

Install the following tools on the server:

* Node.js (v18 or later)
* npm
* Git
* PostgreSQL
* PostGIS extension

Verify installation:

```
node -v
npm -v
git --version
```

---

# 2. Clone the Repository

```
git clone https://github.com/jeff-sparrow/EcoRoute.git
cd EcoRoute
```

---

# 3. Backend Setup

Navigate to the backend directory:

```
cd server
```

Install dependencies:

```
npm install
```

Start backend server:

```
npm start
```

Backend will run on:

```
http://localhost:3000
```

---

# 4. Database Setup

Create database:

```
createdb ecoroute
```

Enable PostGIS extension:

```
CREATE EXTENSION postgis;
```

Import schema if provided in the repository.

---

# 5. Frontend Deployment

Navigate to frontend folder:

```
cd client
```

Install dependencies:

```
npm install
```

Build production version:

```
npm run build
```

Production build will be generated in:

```
client/dist
```

These files can be hosted using:

* Vercel
* Netlify
* Nginx
* Apache

---

# 6. Environment Configuration

Create `.env` file in the client folder.

Example:

```
VITE_ORS_API_KEY=your_api_key
VITE_BACKEND_URL=https://ecoserver-3v5x.onrender.com
```

---

# 7. Production Deployment Example

Recommended architecture:

```
Frontend → Vercel
Backend → Render
Database → PostgreSQL + PostGIS
```

Live frontend example:

```
https://eco-client-sandy.vercel.app
```

---

# 8. Updating the System

To update the deployed system:

```
git pull origin main
npm install
npm run build
```

Restart backend server if required.
